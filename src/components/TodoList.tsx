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
import { db } from "@/db";

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
    () => db.todos.where("listId").equals(listId).sortBy("viewOrder"),
    [listId],
    []
  );

  const addTodoItem = useCallback(
    (t: Partial<TTodoItem>) => {
      const todo = newTodoItem({ listId, ...t });
      // Check length: Math.max will return -Infinity if used on an empty array
      todo.viewOrder =
        todoItems.length === 0
          ? 0
          : Math.max(...todoItems.map((item) => item.viewOrder)) + 1;
      db.todos.add(todo).catch((e) => {
        console.error(e);
        throw e;
      });
    },
    [db, listId]
  );

  const deleteTodoItem = useCallback(
    (todo: TTodoItem | Id) => {
      const todoId = typeof todo === "string" ? todo : todo.id;
      console.log("Removing todo:", todoId);
      db.todos.delete(todoId);
    },
    [db, listId]
  );

  const updateTodoItem = useCallback(
    (todo: PartialWithRequired<TTodoItem, "id">) => {
      console.log("Updating todo:", todo);
      const newTodo: Partial<TTodoItem> = { ...todo };
      delete newTodo["id"];
      Object.keys(newTodo).length > 0 &&
        db.todos.update(todo.id, { ...newTodo });
    },
    [db, listId]
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
        {todos.map((todo) => {
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
