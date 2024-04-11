import React, { FormEvent, useCallback, useRef, useState } from "react";
import { TTodoItem, TTodoList, createId } from "@/types";

import Card from "@mui/joy/Card";
import AddIcon from "@mui/icons-material/Add";
import { Input, Button, List, IconButton, Stack, useTheme } from "@mui/joy";
import { TodoItem, todoChangeEvent } from "./TodoItem";
import { Close } from "@mui/icons-material";

// Omit "id" to avoid collision wiht native "id" prop
type Props = Omit<TTodoList, "id"> & {
  listId: string;
  onRename?: (s: string) => void;
  onDelete?: () => void;
};

// export function TodoList({ todos, toggleTodo, deleteTodo }) {
export function TodoList({ listId, onRename, onDelete, ...todoList }: Props) {
  const [todos, setTodos] = useState<TTodoItem[]>([]);
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();
  const listNameRef = useRef<React.ElementRef<"input"> | undefined>();
  const previousName = useRef(todoList.name);
  const theme = useTheme();

  const addTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTodos((curr) => {
      return [
        ...curr,
        {
          id: createId(),
          title: itemRef.current?.value || "",
          description: "",
          done: false,
        },
      ];
    });
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((curr) => {
      return curr.filter((e) => e.id !== id);
    });
  }, []);

  const updateTodo = useCallback((id: string, type: todoChangeEvent) => {
    switch (type) {
      case "done": {
        setTodos((curr) => {
          return curr.map((e) => {
            if (e.id === id) return { ...e, done: !e.done };
            else return e;
          });
        });
        break;
      }
      case "update": {
        console.log("Item updated", id);
        break;
      }
      default:
        console.log("Not implemented");
        break;
    }
  }, []);

  const handleRenameList = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (listNameRef.current?.value !== previousName.current) {
      previousName.current = listNameRef.current!.value;
      onRename?.(listNameRef.current?.value || "");
    }
    listNameRef.current?.blur();
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
      <form onSubmit={addTodo}>
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
              onDelete={removeTodo}
              key={todo.id}
            />
          );
        })}
      </List>
      {todos.length === 0 && "No Todos"}
    </Card>
  );
}
