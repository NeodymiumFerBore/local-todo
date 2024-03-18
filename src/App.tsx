import { useState } from "react";
import "./styles.css";
import { TodoList } from "./components/TodoList";
import { TodoListsContext } from "./contexts/Todo";
import { GUID, TTodoList } from "./types";
import { Button, CssVarsProvider } from "@mui/joy";
import { ThemeToggle } from "./components/ThemeToggle";
import { GoogleGsiImplicitFlowUseEffect } from "./components/GoogleGsiImplicitFlowUseEffect";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleOAuthImplicitFlow } from "./components/GoogleOAuthImplicitFlow";

export default function App() {
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];

  //   return JSON.parse(localValue);
  // });

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
      {/* REQUIRED TO USE @react-oauth/google (wrap app in this provider) */}
      {/* <GoogleOAuthProvider clientId="79951541504-********************************.apps.googleusercontent.com"> */}
      <CssVarsProvider defaultMode="system">
        <ThemeToggle />
        <TodoListsContext.Provider value={{ todoLists, setTodoLists }}>
          <GoogleGsiImplicitFlowUseEffect />
          {/* <GoogleOAuthImplicitFlow /> */}
          <h1 className="header">Todo List</h1>
          <Button onClick={addList}>Add List</Button>
          <div>
            {todoLists.length === 0 && "No TodoList"}
            {todoLists.map((list) => {
              return <TodoList key={list.id.toString()} thisTodoList={list} />;
            })}
          </div>
        </TodoListsContext.Provider>
      </CssVarsProvider>
      {/* </GoogleOAuthProvider> */}
    </>
  );
}
