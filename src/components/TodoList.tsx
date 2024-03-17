import { useRef } from "react";
import { GUID, TTodoList } from "@/types";
import { useTodoListsContext } from "@/contexts/Todo";
import { listsWithUpdatedItem } from "@/helpers/todoLists";

import Card from "@mui/joy/Card";
import AddIcon from "@mui/icons-material/Add";
import { Input, Button, Typography, List } from "@mui/joy";
import { TodoItem } from "./TodoItem";

type Props = {
  thisTodoList: TTodoList;
};

// export function TodoList({ todos, toggleTodo, deleteTodo }) {
export function TodoList({ thisTodoList }: Props) {
  const { todoLists, setTodoLists } = useTodoListsContext();
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();

  function addTodoItem(e: React.FormEvent) {
    e.preventDefault();
    setTodoLists(
      listsWithUpdatedItem(todoLists, thisTodoList.id, {
        id: new GUID(),
        title: itemRef.current?.value || "",
        description: "",
        done: false,
      })
    );
  }

  return (
    <Card>
      <Typography level="title-lg">{thisTodoList.title}</Typography>
      <form onSubmit={addTodoItem}>
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
        {thisTodoList.items.map((todo) => {
          return (
            <TodoItem
              ownerList={thisTodoList.id}
              thisItem={todo}
              key={todo.id.toString()}
            />
          );
        })}
      </List>
      <ul className="list">{thisTodoList.items.length === 0 && "No Todos"}</ul>
    </Card>
  );
}
