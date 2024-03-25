import { useState } from "react";
import "./styles.css";
import { TodoList } from "./components/TodoList";
import { TodoListsContext } from "./contexts/Todo";
import { GUID, TTodoItem, TTodoList } from "./types";
import { Box, Button, CssVarsProvider, Stack } from "@mui/joy";
import { ThemeToggle } from "./components/ThemeToggle";
import Board from "./components/Board";

export default function App() {
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];

  //   return JSON.parse(localValue);
  // });

  const [todos, setTodos] = useState<TTodoItem[]>([]);
  const [todoLists, setTodoLists] = useState<TTodoList[]>([]);

  // useEffect(() => {
  //   localStorage.setItem("ITEMS", JSON.stringify(todos));
  // }, [todos]);

  function addList() {
    if (todoLists.length > 0) return;

    const newList = {
      id: new GUID(),
      title: `List ${todoLists.length + 1}`,
      description: "",
      items: [],
    };
    setTodoLists((currentLists) => {
      return [...currentLists, newList];
    });
  }

  return (
    <>
      <CssVarsProvider defaultMode="system">
        <ThemeToggle />
        <TodoListsContext.Provider value={{ todoLists, setTodoLists }}>
          <h1 className="header">Todo List</h1>
          <Stack sx={{ alignItems: "center" }}>
            <Board sx={{}} />
          </Stack>
        </TodoListsContext.Provider>
      </CssVarsProvider>
    </>
  );
}
