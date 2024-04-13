import React, { FormEvent, useCallback, useRef } from "react";
import {
  Id,
  PartialWithRequired,
  TTodoItem,
  TTodoList,
  newTodoItem,
} from "@/types";

import Card from "@mui/joy/Card";
import AddIcon from "@mui/icons-material/Add";
import { Close } from "@mui/icons-material";
import { Input, Button, List, IconButton, Stack, useTheme } from "@mui/joy";
import { TodoItem } from "./TodoItem";

import { useLiveQuery } from "dexie-react-hooks";
import { db, getNextViewOrder } from "@/db";

// Omit "id" to avoid collision wiht native "id" prop
type Props = Omit<TTodoList, "id"> & {
  listId: Id;
  onRename?: (s: string) => void;
  onDelete?: () => void;
};

const usePersistentTodoItems = (
  listId: Id
): [
  todoItems: TTodoItem[],
  addTodoItem: (todo: Partial<TTodoItem>) => void,
  deleteTodoItem: (todo: TTodoItem | Id) => void,
  updateTodoItem: (todo: PartialWithRequired<TTodoItem, "id">) => void
] => {
  const todoItems = useLiveQuery(
    // Do not use Collection.reverse(). For some reason, all todoItems re-render when the collection changes,
    // but they do not if the consumer component handles the reverse order itself.
    () => db.todos.where("listId").equals(listId).sortBy("viewOrder"),
    [db, listId],
    []
  );

  const addTodoItem = useCallback(
    (t: Partial<TTodoItem>) => {
      const todo = newTodoItem({ listId, ...t });
      getNextViewOrder("todos", listId)
        .then((res) => {
          todo.viewOrder = res;
          db.todos.add(todo);
        })
        .catch((e) => {
          console.error("Error adding todo", todo);
          console.error(e);
          throw e;
        });
    },
    [listId]
  );

  const deleteTodoItem = useCallback((todo: TTodoItem | Id) => {
    const todoId = typeof todo === "string" ? todo : todo.id;
    console.log("Removing todo:", todoId);
    db.todos.delete(todoId).catch((e) => {
      console.error("Error removing todo", todo);
      console.error(e);
      throw e;
    });
  }, []);

  const updateTodoItem = useCallback(
    (todo: PartialWithRequired<TTodoItem, "id">) => {
      console.log("Updating todo:", todo);
      const newTodo: Partial<TTodoItem> = { ...todo };
      delete newTodo["id"];
      Object.keys(newTodo).length > 0 &&
        db.todos.update(todo.id, { ...newTodo }).catch((e) => {
          console.error("Error updating todo", newTodo);
          console.error(e);
          throw e;
        });
    },
    []
  );

  return [todoItems, addTodoItem, deleteTodoItem, updateTodoItem];
};

// export function TodoList({ todos, toggleTodo, deleteTodo }) {
export function TodoList({ listId, onRename, onDelete, ...todoList }: Props) {
  // const [todos, setTodos] = useState<TTodoItem[]>([]);
  const [todos, addTodo, deleteTodo, updateTodo] =
    usePersistentTodoItems(listId);
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();
  const listNameRef = useRef<React.ElementRef<"input"> | undefined>();
  const previousName = useRef(todoList.name);
  const theme = useTheme();

  const handleRenameList = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (listNameRef.current?.value !== previousName.current) {
      previousName.current = listNameRef.current!.value;
      onRename?.(listNameRef.current?.value || "");
    }
    listNameRef.current?.blur();
  }, []);

  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    addTodo({ name: itemRef.current?.value || "" });
  }, []);

  console.log("Rendering list", listId);
  return (
    <Card
      sx={{ height: "fit-content", flex: "none", scrollSnapAlign: "start" }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <form onSubmit={handleRenameList}>
          <Input
            slotProps={{
              input: { ref: listNameRef as React.RefObject<HTMLInputElement> },
            }}
            sx={{
              backgroundColor: "transparent",
              ":focus-within": {
                backgroundColor: theme.vars.palette.neutral.plainActiveBg,
              },
              "--Input-focusedThickness": "0px",
              "&.Mui-selected": { outline: "none" },
              ":hover:not(:focus-within)": {
                backgroundColor: theme.vars.palette.neutral.plainHoverBg,
              },
            }}
            onBlur={handleRenameList}
            placeholder="My List"
            variant="plain"
            defaultValue={todoList.name}
          ></Input>
        </form>
        <IconButton onClick={onDelete}>
          <Close />
        </IconButton>
      </Stack>
      <form onSubmit={handleAddTodo}>
        <Input
          slotProps={{
            input: { ref: itemRef as React.RefObject<HTMLInputElement> },
          }}
          required
          placeholder="Add a task..."
          endDecorator={
            <Button type="submit">
              <AddIcon />
            </Button>
          }
        />
      </form>
      <List>
        {/* Array.proto.toReversed() added in July 2023. Stick to .reverse() on a
        shallow copy for now. Worse perf, but better compatibility */}
        {[...todos].reverse().map((todo) => {
          return (
            <TodoItem
              thisItem={todo}
              onChange={updateTodo}
              onDelete={deleteTodo}
              key={todo.id}
            />
          );
        })}
      </List>
      {todos.length === 0 && "No Todos"}
    </Card>
  );
}
