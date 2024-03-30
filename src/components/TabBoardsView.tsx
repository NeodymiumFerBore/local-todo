import { useState } from "react";
import { Stack, Tab, TabList, TabPanel, Tabs, useTheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { Id, TBoard, newBoard } from "@/types";
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
      onChange={(_, i) => {
        console.log("board length:", boards.length, "i:", i);
        if (i === boards.length) {
          setBoards((curr) => [...curr, newBoard({ title: "New Board" })]);
        }
      }}
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
        <Tab key={crypto.randomUUID()}>
          <Add />
        </Tab>
      </TabList>
      {boards.map((board, i) => {
        return (
          <TabPanel
            key={board.id}
            value={i}
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
