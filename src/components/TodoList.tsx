import React, { useCallback, useRef, useState } from "react";
import { TTodoItem, createId } from "@/types";

import Card from "@mui/joy/Card";
import AddIcon from "@mui/icons-material/Add";
import { Input, Button, Typography, List } from "@mui/joy";
import { TodoItem, todoChangeEvent } from "./TodoItem";

type Props = {
  listId: string;
};

// export function TodoList({ todos, toggleTodo, deleteTodo }) {
export function TodoList({ listId }: Props) {
  const [todos, setTodos] = useState<TTodoItem[]>([]);
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();

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

  return (
    <Card sx={{ height: "fit-content" }}>
      <Typography level="title-lg">{listId}</Typography>
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
