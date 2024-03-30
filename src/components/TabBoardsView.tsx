import { useState } from "react";
import { Stack, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Id, TBoard } from "@/types";
import Board from "./Board";
import { EditableTab } from "./EditableTab";

export function TabBoardsView() {
  const theme = useTheme();
  const [boards, setBoards] = useState<TBoard[]>([
    {
      id: crypto.randomUUID() as Id,
      title: "test",
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
    <Tabs
      size="lg"
      sx={{ backgroundColor: theme.vars.palette.background.level1 }}
    >
      <TabList disableUnderline>
        {boards.map((board) => {
          return (
            <EditableTab
              key={board.id}
              initialName={board.title}
              variant="plain"
              color="neutral"
              onRename={(s) => renameBoard(s, board.id)}
            />
          );
        })}
      </TabList>
      {boards.map((board) => {
        return (
          <TabPanel
            key={board.id}
            sx={{ backgroundColor: theme.vars.palette.background.level1 }}
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
