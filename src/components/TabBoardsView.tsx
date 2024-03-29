import { Stack, Tab, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import Board from "./Board";
import { Id, TBoard } from "@/types";
import { useState } from "react";

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

  return (
    <Tabs
      size="lg"
      sx={{ backgroundColor: theme.vars.palette.background.level1 }}
    >
      <TabList disableUnderline>
        {boards.map((board) => {
          return (
            <Tab key={board.id} variant="plain" color="neutral">
              {board.title}
            </Tab>
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
