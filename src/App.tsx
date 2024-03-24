import { useState } from "react";
import { TodoListsContext } from "./contexts/Todo";
import { GUID, TTodoList, Todo } from "./types";
import { CssVarsProvider, IconButton, Stack, Typography } from "@mui/joy";
import { ThemeToggle } from "./components/ThemeToggle";
import { Add, DeveloperBoard } from "@mui/icons-material";
import {
  generateTodoItemBunch,
  generateTodoItemMap,
  generateTodoItemMapBunch,
} from "./components/data";
import Board from "@/components/MyBoard2";
import { todoLists as premadeTodoLists } from "./components/data";
import { todos as premadeTodos } from "./components/data";
import "./styles.css";

/**
 * For the drag'n'drop feature to be fluid, we memoize all items in todo lists.
 * If we manage the state from here (and shared by props or context), the memoization
 * does not work. Every time an item is dragged, if it touches the state, the whole Board
 * re-renders.
 *
 * Workaround: we let the Board to manage its own state, and it will fire events.
 * From places where we want to know about Todos changes, we subscribe to these events.
 *
 * As Todos and TodoLists are separate objects (a Todo refering to its TodoList by its ID),
 * we can easily listen for change for 1 todo at a time (example: content change).
 *
 * For ordering, we have to listen for the whole array change. It will be memory consuming,
 * but the performance gain on Board UX is worth it.
 */

export default function App() {
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];

  //   return JSON.parse(localValue);
  // });
  const [developerMode, setDeveloperMode] = useState(false);

  const [todoLists, setTodoLists] = useState<TTodoList[]>(premadeTodoLists);
  const [todos, setTodos] = useState<Todo[]>(generateTodoItemBunch(200));

  // useEffect(() => {
  //   localStorage.setItem("ITEMS", JSON.stringify(todos));
  // }, [todos]);

  function addList() {
    // if (todoLists.length > 0) return;

    const newList: TTodoList = {
      id: new GUID().str,
      name: `List ${todoLists.length + 2}`,
      description: "",
    };
    setTodoLists((currentLists) => {
      return [...currentLists, newList];
    });
  }

  function addTodo(newTodo: Todo) {
    console.log("Adding todo in App: ", newTodo);
  }

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
          <IconButton variant="solid" color="neutral" onClick={addList}>
            <Add />
          </IconButton>
          <ThemeToggle />
        </Stack>
        {/* Board */}
        <Stack alignItems={"center"}>
          <Typography level="h1">Todo List</Typography>
          {/* <Board initial={generateTodoItemMap()}></Board> */}
          <Board
            todos={todos}
            onTodosChange={setTodos}
            todoLists={todoLists}
            onTodoListsChange={setTodoLists}
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
