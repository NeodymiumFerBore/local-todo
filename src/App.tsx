import { useState } from "react";
import "./styles.css";
import { TodoList } from "./components/TodoList";
import { TodoListsContext } from "./contexts/Todo";
import { GUID, TTodoList } from "./types";
import {
  Box,
  Button,
  CssVarsProvider,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { ThemeToggle } from "./components/ThemeToggle";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import DroppableList from "./components/DroppableList";
import Board from "@/components/MyBoard";
import { authorQuoteMap, generateQuoteMap } from "./components/data";
import { QuoteItem } from "./primatives/quote-item";
import { DeveloperBoard } from "@mui/icons-material";
import { env } from "process";

export default function App() {
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];

  //   return JSON.parse(localValue);
  // });
  const [developerMode, setDeveloperMode] = useState(false);

  const [quotes, setQuotes] = useState(generateQuoteMap(500));

  const [todoLists, setTodoLists] = useState<TTodoList[]>(
    [
      {
        id: new GUID(),
        title: "List 1",
        description: "",
        items: [
          {
            id: new GUID(),
            title: "Item 1 List 1",
            description: "",
            done: false,
          },
          {
            id: new GUID(),
            title: "Item 2 List 1",
            description: "",
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
            title: "Item 1 List 2",
            description: "",
            done: false,
          },
          {
            id: new GUID(),
            title: "Item 2 List 2",
            description: "",
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
            title: "Item 1 List 3",
            description: "",
            done: false,
          },
          {
            id: new GUID(),
            title: "Item 2 List 3",
            description: "",
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
            title: "Item 1 List 4",
            description: "",
            done: false,
          },
          {
            id: new GUID(),
            title: "Item 2 List 4",
            description: "",
            done: false,
          },
        ],
      },
    ].slice(0, 3)
  );

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

  const [lists, setLists] = useState([
    {
      title: "List 1",
      todos: [
        { id: "task-1", content: "Task 1" },
        { id: "task-2", content: "Task 2" },
        // More tasks...
      ],
    },
  ]);
  const handleDragEnd = (result: DropResult): void => {
    // TODO: Update the tasks state based on the result
    console.log("handle drag: ", result);
  };
  return (
    <>
      {/* <CssVarsProvider defaultMode="system"> */}
      <TodoListsContext.Provider value={{ todoLists, setTodoLists }}>
        <CssVarsProvider defaultMode="light">
          {/* <Board initial={authorQuoteMap}></Board> */}
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
            <Board quotes={quotes} setQuotes={setQuotes}></Board>
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
      </TodoListsContext.Provider>
    </>
  );
}
