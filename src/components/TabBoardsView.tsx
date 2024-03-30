import { useState } from "react";
import { IconButton, Stack, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { Id, TBoard, newBoard } from "@/types";
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
    <Tabs size="lg">
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
              onDelete={() =>
                setBoards((curr) => curr.filter((e) => e.id !== board.id))
              }
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
          onClick={() =>
            setBoards((curr) => [...curr, newBoard({ title: "New Board" })])
          }
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
