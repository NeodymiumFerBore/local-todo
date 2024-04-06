import { TTodoList, Id, newTodoList } from "@/types";
import { Box, Button, Stack } from "@mui/joy";
import { SxProps } from "@mui/system";
import { TodoList } from "./TodoList";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

interface Props {
  boardId: Id;
  sx?: SxProps;
}

const usePersistentTodoLists = (
  boardId: Id
): [
  todoLists: TTodoList[],
  addTodoList: (list?: TTodoList) => void,
  deleteTodoList: (list: TTodoList | Id) => void
] => {
  const todoLists = useLiveQuery(
    () => db.todoLists.where("boardId").equals(boardId).sortBy("viewOrder"),
    [boardId],
    []
  );

  function addTodoList(l?: TTodoList) {
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
  }

  function deleteTodoList(l: TTodoList | Id) {
    const listId = typeof l === "string" ? l : l.id;
    console.log("Removing list:", listId);
    db.todoLists.delete(listId);
  }

  /** @TODO REQUIRE ID */
  function updateTodoList(l: Partial<TTodoList>) {
    console.log("Updating list:", l.id);
    db.todoLists.get({ id: l.id }).then((list) => {
      db.todoLists.update({ id: l.id }, { ...list, ...l });
    });
  }

  return [todoLists, addTodoList, deleteTodoList];
};

function Board(props: Props) {
  // const [todoLists, setTodoLists] = useState<TTodoList[]>([]);
  const [todoLists, addTodoList, deleteTodoList] = usePersistentTodoLists(
    props.boardId
  );

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
            return <TodoList key={list.id} listId={list.id} />;
          })}
        </Stack>
      </Stack>
    </>
  );
}

export default Board;
