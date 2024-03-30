import { useState } from "react";
import { IconButton, Stack, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { Id, TBoard, createId, newBoard } from "@/types";
import Board from "./Board";
import { EditableTab } from "./EditableTab";

export function TabBoardsView() {
  const theme = useTheme();
  const [boards, setBoards] = useState<TBoard[]>([
    {
      id: crypto.randomUUID() as Id,
      title: "Board 1",
      description: "test description",
      whenCreated: new Date(),
      whenModified: new Date(),
    },
  ]);
  const [selected, setSelected] = useState<Id | null>(
    boards.length > 0 ? boards[0].id : null
  );

  function renameBoard(name: string, boardId: Id) {
    setBoards((curr) => {
      return curr.map((e) => {
        if (e.id === boardId) return { ...e, title: name };
        else return e;
      });
    });
  }

  console.log("Rendering TabBoardsView");
  return (
    <Tabs
      size="lg"
      value={selected}
      onChange={(_, v) => {
        // When deleting a tab, it also triggers a tab change.
        // Check if tab still exists before switching to it.
        if (boards.some((board) => board.id === v)) setSelected(v as Id);
      }}
    >
      <TabList
        disableUnderline
        sx={{
          overflow: "auto",
          scrollSnapType: "x mandatory",
          backgroundColor: theme.vars.palette.background.level1,
          ":hover": theme.vars.palette.background.level2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {boards.map((board) => {
          return (
            <EditableTab
              key={board.id}
              value={board.id}
              initialName={board.title}
              variant="plain"
              color="neutral"
              onDelete={() => {
                // If deleted tab is the currently selected, select another one if possible
                if (selected === board.id && boards.length > 1) {
                  const i = boards.findIndex((e) => e.id === board.id);
                  // Try to select next tab. Visually, it looks like selection stays in place
                  setSelected(
                    i < boards.length - 1 ? boards[i + 1].id : boards[i - 1].id
                  );
                }
                setBoards((curr) => curr.filter((e) => e.id !== board.id));
              }}
              onRename={(s) => renameBoard(s, board.id)}
              sx={{
                flex: "none",
                scrollSnapAlign: "start",
              }}
            />
          );
        })}
        <IconButton
          key={crypto.randomUUID()}
          onClick={() => {
            const newBoardId = createId();
            setBoards((curr) => [
              ...curr,
              newBoard({ id: newBoardId, title: "New Board" }),
            ]);
            setSelected(newBoardId);
          }}
        >
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
