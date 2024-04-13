import { Id, TTodoList, newTodoList, PartialWithRequired } from "@/types";
import { Box, Button, Stack } from "@mui/joy";
import { SxProps } from "@mui/system";
import { TodoList } from "./TodoList";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { useCallback } from "react";

interface Props {
  boardId: Id;
  sx?: SxProps;
}

const usePersistentTodoLists = (
  boardId: Id
): [
  todoLists: TTodoList[],
  addTodoList: (list?: TTodoList) => void,
  deleteTodoList: (list: TTodoList | Id) => void,
  updateTodoList: (list: PartialWithRequired<TTodoList, "id">) => void
] => {
  const todoLists = useLiveQuery(
    () => db.todoLists.where("boardId").equals(boardId).sortBy("viewOrder"),
    [db, boardId],
    []
  );

  const addTodoList = useCallback(
    (l?: TTodoList) => {
      const list = l || newTodoList({ boardId });
      list.name = list.id.slice(0, 6);
      // Check length: Math.max will return -Infinity if used on an empty array
      list.viewOrder =
        todoLists.length === 0
          ? 0
          : Math.max(...todoLists.map((item) => item.viewOrder)) + 1;
      db.todoLists.add(list).catch((e) => {
        console.error(e);
        throw e;
      });
    },
    [db, boardId]
  );

  const deleteTodoList = useCallback(
    (l: TTodoList | Id) => {
      const listId = typeof l === "string" ? l : l.id;
      console.log("Removing list:", listId);
      db.todoLists.delete(listId);
    },
    [db, boardId]
  );

  const updateTodoList = useCallback(
    (l: PartialWithRequired<TTodoList, "id">) => {
      console.log("Updating list:", l);
      const newList: Partial<TTodoList> = { ...l };
      delete newList["id"];
      if (Object.keys(newList).length > 0)
        db.todoLists.update(l.id, { ...newList });
    },
    [db, boardId]
  );

  return [todoLists, addTodoList, deleteTodoList, updateTodoList];
};

function Board(props: Props) {
  const [todoLists, addTodoList, deleteTodoList, updateTodoList] =
    usePersistentTodoLists(props.boardId);

  console.log("Rendering Board", props.boardId);
  return (
    <>
      <Stack sx={props.sx} spacing={1}>
        <Box justifyContent={"center"} display={"flex"}>
          <Button onClick={() => addTodoList()}>Add List</Button>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          sx={{ overflow: "auto", scrollSnapType: "x mandatory" }}
        >
          {todoLists.length === 0 && "No TodoList"}
          {todoLists.map((list) => {
            return (
              <TodoList
                {...list}
                key={list.id}
                listId={list.id}
                onRename={(s) => updateTodoList({ id: list.id, name: s })}
                onDelete={() => deleteTodoList(list.id)}
              />
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}

export default Board;
