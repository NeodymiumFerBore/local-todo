import React, { useRef, useState } from "react";
import { GUID, TTodoItem } from "@/types";

import Card from "@mui/joy/Card";
import AddIcon from "@mui/icons-material/Add";
import { Input, Button, Typography, List } from "@mui/joy";
import TodoItem, { todoChangeEvent } from "./TodoItem";

type Props = {
  listId: string;
};

// export function TodoList({ todos, toggleTodo, deleteTodo }) {
export function TodoList({ listId }: Props) {
  const [todos, setTodos] = useState<TTodoItem[]>([]);
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    setTodos((curr) => {
      return [
        ...curr,
        {
          id: new GUID(),
          title: itemRef.current?.value || "",
          description: "",
          done: false,
        },
      ];
    });
  }

  function removeTodo(id: string) {
    setTodos((curr) => {
      return curr.filter((e) => e.id.toString() !== id);
    });
  }

  function updateTodo(id: string, type: todoChangeEvent) {
    switch (type) {
      case "done": {
        console.log("Item is done", id);
        setTodos((curr) => {
          return curr.map((e) => {
            if (e.id.toString() === id) return { ...e, done: !e.done };
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
  }

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
              key={todo.id.toString()}
            />
          );
        })}
      </List>
      <ul className="list">{todos.length === 0 && "No Todos"}</ul>
    </Card>
  );
}
