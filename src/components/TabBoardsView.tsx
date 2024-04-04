import { useCallback, useEffect, useState } from "react";
import { IconButton, Stack, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { Id, TBoard, createId, newBoard } from "@/types";
import Board from "./Board";
import { EditableTab } from "./EditableTab";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

/**
 * Do not handle selected tab with useLiveQuery. Selecting a tab would instantly
 * select it on another tab, making it impossible to look at different boards
 * at the same time. Use local storage or IDB, but do not watch for changes.
 * Local storage may be easier and more adapted.
 */
const usePersistentTabBoardsView = (): [
  boards: TBoard[],
  selected: TBoard | undefined,
  addBoard: (b?: TBoard) => void,
  deleteBoard: (b: TBoard | Id) => void,
  setSelected: (boardId: Id) => void
] => {
  const boards = useLiveQuery(
    () => db.boards.orderBy("viewOrder").toArray(),
    [],
    []
  );
  const selected = useLiveQuery(() => db.boards.get({ selected: 1 }));
  function setSelected(boardId: Id) {
    console.log("Selecting board:", boardId);
    db.transaction("rw", db.boards, async () => {
      db.boards.where({ selected: 1 }).modify({ selected: 0 });
      db.boards.where({ id: boardId }).modify({ selected: 1 });
    });
  }

  function addBoard(b?: TBoard) {
    const board = b || newBoard();
    // const newBoardId = createId();
    // Check length: Math.max will return -Infinity if used on an empty array
    // const viewOrder =
    board.viewOrder =
      boards.length === 0
        ? 1
        : Math.max(...boards.map((item) => item.viewOrder)) + 1;
    db.transaction("rw", db.boards, async () => {
      db.boards.add(board);
      // db.boards.add({
      //   ...board,
      //   viewOrder: viewOrder,
      // });
      // await setSelected(board);
      // Unselect any selected board
      // setSelected(board.id);
      db.boards.where({ selected: 1 }).modify({ selected: 0 });
      db.boards.where({ id: board.id }).modify({ selected: 1 });

      // db.boards.where({ selected: 1 }).modify({ selected: 0 });
    });
  }

  function deleteBoard(b: TBoard | Id) {
    const boardId = typeof b === "string" ? b : b.id;
    console.log("Removing board:", boardId);
    db.transaction("rw", db.boards, async () => {
      db.boards.delete(boardId);
    });
  }

  // async function setSelected(b: TBoard | Id) {
  //   const board: TBoard | undefined =
  //     typeof b === "string" ? await db.boards.get({ id: b }) : b;
  //   if (board === undefined) return;

  //   db.transaction("rw", db.boards, async () => {
  //     // db.boards.get(selected?.id).then((v) => (v!.selected = false));
  //     await db.boards.where({ selected: 1 }).modify({ selected: 0 });
  //     await db.boards.update({ id: board.id }, { selected: 1 });
  //   }).then(() => console.log("setSelected: transaction complete!"));
  // }

  return [boards, selected, addBoard, deleteBoard, setSelected]; //, selected, setSelected];
};

export function TabBoardsView() {
  const theme = useTheme();
  // const [boards, addBoard, selected, setSelected] =
  const [boards, selected, addBoard, deleteBoard, setSelected] =
    usePersistentTabBoardsView();

  function renameBoard(name: string, boardId: Id) {
    db.boards.where({ id: boardId }).modify((b) => {
      b.name = name;
    });
  }

  console.log("Rendering TabBoardsView");
  return (
    <Tabs
      size="lg"
      // value={selected?.id || null}
      value={selected?.id || null}
      onChange={(_, v) => {
        // When deleting a tab, it also triggers a tab change.
        // Check if tab still exists before switching to it.
        if (boards.some((board) => board.id === v)) setSelected(v as Id);
        // setSelected(v as Id);
      }}
    >
      <TabList
        disableUnderline
        sx={{
          overflow: "auto",
          scrollSnapType: "x mandatory",
          backgroundColor: theme.vars.palette.background.level1,
          ":hover": theme.vars.palette.background.level2,
        }}
      >
        {boards.map((board) => {
          return (
            <EditableTab
              key={board.id}
              value={board.id}
              initialName={board.id.slice(0, 6)}
              variant="plain"
              color="neutral"
              // onDelete={() => deleteBoard(board.id)}
              onDelete={() => {
                // If deleted tab is the currently selected, select another one if possible
                if (selected?.id === board.id && boards.length > 1) {
                  const i = boards.findIndex((e) => e.id === board.id);
                  // Try to select next tab. Visually, it looks like selection stays in place
                  setSelected(
                    i < boards.length - 1 ? boards[i + 1].id : boards[i - 1].id
                  );
                }
                deleteBoard(board.id);
                // db.boards.where({ id: board.id }).delete();
                // setBoards((curr) => curr.filter((e) => e.id !== board.id));
              }}
              onRename={(s) => renameBoard(s, board.id)}
              sx={{
                flex: "none",
                scrollSnapAlign: "start",
              }}
            />
          );
        })}
        <IconButton key={crypto.randomUUID()} onClick={() => addBoard()}>
          <Add />
        </IconButton>
      </TabList>
      {boards.map((board) => {
        return (
          <TabPanel
            key={board.id}
            value={board.id}
            sx={{ backgroundColor: "#333" }}
          >
            <Stack sx={{ alignItems: "center" }}>
              <Board boardId={board.id} sx={{}} />
            </Stack>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
