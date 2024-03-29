import { TTodoList, Id, createId } from "@/types";
import { Box, Button, Stack } from "@mui/joy";
import { SxProps } from "@mui/system";
import { useCallback, useState } from "react";
import { TodoList } from "./TodoList";

interface Props {
  boardId: Id;
  sx?: SxProps;
}

function Board(props: Props) {
  const [todoLists, setTodoLists] = useState<TTodoList[]>([]);

  const addTodoList = useCallback(() => {
    console.log("Adding new list");
    setTodoLists((curr) => {
      return [
        ...curr,
        { id: createId(), title: "", description: "", items: [] },
      ];
    });
  }, []);

  console.log("Rendering Board");
  return (
    <>
      <Stack sx={props.sx}>
        <Box justifyContent={"center"} display={"flex"}>
          <Button onClick={addTodoList}>Add List</Button>
        </Box>
        <Stack direction="row" spacing={2} alignSelf="center">
          {todoLists.length === 0 && "No TodoList"}
          {todoLists.map((list) => {
            return <TodoList key={list.id} listId={list.id} />;
          })}
        </Stack>
      </Stack>
    </>
  );
}

export default Board;
