import { useState } from "react";
import { TodoListsContext } from "./contexts/Todo";
import { GUID, TTodoList } from "./types";
import { CssVarsProvider, IconButton, Stack, Typography } from "@mui/joy";
import { ThemeToggle } from "./components/ThemeToggle";
import { DeveloperBoard } from "@mui/icons-material";
import { generateTodoListMap, generateTodoLists } from "./components/data";
import Board from "@/components/MyBoard";
import "./styles.css";

export default function App() {
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];

  //   return JSON.parse(localValue);
  // });
  const [developerMode, setDeveloperMode] = useState(false);
  const todoLists = [
    {
      id: new GUID(),
      title: "List 1",
      description: "",
      items: [
        {
          id: new GUID(),
          content: "Item 1 List 1",
          done: false,
        },
        {
          id: new GUID(),
          content: "Item 2 List 1",
          done: false,
        },
      ],
    },
    {
      id: new GUID(),
      title: "List 2",
      description: "",
      items: [
        {
          id: new GUID(),
          content: "Item 1 List 2",
          done: false,
        },
        {
          id: new GUID(),
          content: "Item 2 List 2",
          done: false,
        },
      ],
    },
    {
      id: new GUID(),
      title: "List 3",
      description: "",
      items: [
        {
          id: new GUID(),
          content: "Item 1 List 3",
          done: false,
        },
        {
          id: new GUID(),
          content: "Item 2 List 3",
          done: false,
        },
      ],
    },
    {
      id: new GUID(),
      title: "List 4",
      description: "",
      items: [
        {
          id: new GUID(),
          content: "Item 1 List 4",
          done: false,
        },
        {
          id: new GUID(),
          content: "Item 2 List 4",
          done: false,
        },
      ],
    },
  ].slice(0, 3);

  // useEffect(() => {
  //   localStorage.setItem("ITEMS", JSON.stringify(todos));
  // }, [todos]);

  // function addList() {
  //   if (todoLists.length > 0) return;

  //   const newList = {
  //     id: new GUID(),
  //     title: `List ${todoLists.length + 1}`,
  //     description: "",
  //     items: [],
  //   };
  //   setTodoLists((currentLists) => {
  //     return [...currentLists, newList];
  //   });
  // }

  return (
    <>
      {/* <CssVarsProvider defaultMode="system"> */}
      {/* <TodoListsContext.Provider value={{ todoLists, setTodoLists }}> */}
      <CssVarsProvider defaultMode="system">
        {/* Navigation and option top menu */}
        <Stack direction={"row"} justifyContent={"right"} spacing={1}>
          {process.env.NODE_ENV === "development" && (
            <IconButton
              variant="solid"
              color="neutral"
              onClick={() => setDeveloperMode(!developerMode)}
            >
              <DeveloperBoard />
            </IconButton>
          )}
          <ThemeToggle />
        </Stack>
        {/* Board */}
        <Stack alignItems={"center"}>
          <Typography level="h1">Todo List</Typography>
          {/* <Board initial={generateQuoteMap(500)}></Board> */}
          {/* <Board initial={generateTodoLists(3, 10, 20)}></Board> */}
          <Board
            initial={generateTodoListMap(generateTodoLists(3, 10, 20))}
          ></Board>
        </Stack>
        {/*
          <Button onClick={addList}>Add List</Button>
          <div>
            {todoLists.length === 0 && "No TodoList"}
            {todoLists.map((list) => {
              return <TodoList key={list.id.toString()} thisTodoList={list} />;
            })}
          </div>
           */}
      </CssVarsProvider>
      {/* </TodoListsContext.Provider> */}
    </>
  );
}
