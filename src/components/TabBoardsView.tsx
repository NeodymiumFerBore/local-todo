import { IconButton, Stack, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { Id, TBoard, newBoard } from "@/types";
import Board from "./Board";
import { EditableTab } from "./EditableTab";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { useLocalStorage } from "@/utils/loadFromLocalStorage";

/**
 * Do not handle selected tab with useLiveQuery. Selecting a tab would instantly
 * select it on another tab, making it impossible to look at different boards
 * at the same time. Use local storage or IDB, but do not watch for changes.
 * Still easier to handle it here: can await for db transaction without defining
 * async callbacks on consumer side.
 */
const usePersistentTabBoardsView = (): [
  boards: TBoard[],
  selected: Id | undefined,
  addBoard: (b?: TBoard) => void,
  deleteBoard: (b: TBoard | Id) => void,
  setSelected: (boardId: Id) => void
] => {
  const boards = useLiveQuery(
    () => db.boards.orderBy("viewOrder").toArray(),
    [],
    []
  );
  const [selected, setSelected] = useLocalStorage<Id>("selectedBoard");

  function addBoard(b?: TBoard) {
    const board = b || newBoard();
    board.name = board.id.slice(0, 6);
    // Check length: Math.max will return -Infinity if used on an empty array
    board.viewOrder =
      boards.length === 0
        ? 1
        : Math.max(...boards.map((item) => item.viewOrder)) + 1;
    db.transaction("rw", db.boards, async () => {
      db.boards.add(board);
    });
    setSelected(board.id);
  }

  async function deleteBoard(b: TBoard | Id) {
    const boardId = typeof b === "string" ? b : b.id;
    console.log("Removing board:", boardId);
    db.transaction("rw", db.boards, async () => {
      await db.boards.delete(boardId);

      // If deleted tab is the currently selected, select another one if possible
      if (selected === boardId && boards.length > 1) {
        const i = boards.findIndex((e) => e.id === boardId);
        // Try to select next tab. Visually, it looks like selection stays in place
        setSelected(
          i < boards.length - 1 ? boards[i + 1].id : boards[i - 1].id
        );
      } else setSelected(selected); // workaround deleted tab being selected
    });
  }

  return [boards, selected, addBoard, deleteBoard, setSelected];
};

export function TabBoardsView() {
  const theme = useTheme();
  const [boards, selected, addBoard, deleteBoard, setSelected] =
    usePersistentTabBoardsView();

  /** @TODO change to updateBoard, and take Partial<TBoard> as arg */
  function renameBoard(name: string, boardId: Id) {
    console.log("Renaming board", boardId, name);
    db.boards.where({ id: boardId }).modify((b) => {
      b.name = name;
    });
  }

  console.log("Rendering TabBoardsView");
  return (
    <Tabs
      size="lg"
      // value={selected?.id || null}
      value={selected || null}
      onChange={(_, v) => {
        // When deleting a tab, it also triggers a tab change.
        // Check if tab still exists before switching to it.
        // if (boards.some((board) => board.id === v)) setSelected(v as Id);
        setSelected(v as Id);
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
              initialName={board.name}
              variant="plain"
              color="neutral"
              onDelete={() => deleteBoard(board.id)}
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
