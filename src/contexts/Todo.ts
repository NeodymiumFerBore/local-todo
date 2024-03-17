import { createContext, useContext } from "react";
import { TTodoItem, TTodoList } from "@/types";

/* Create a type for TodoItemsContext */
type TTodoItemsContext = {
  todoItems: TTodoItem[];
  setTodoItems: (i: TTodoItem[]) => void;
};

/* Define the actual TodoItemsContext Context */
export const TodoItemsContext = createContext<TTodoItemsContext>({
  todoItems: [],
  setTodoItems: () => {},
});

/* Create a type for TodoListsContext */
type TTodoListContext = {
  todoLists: TTodoList[];
  setTodoLists: (i: TTodoList[]) => void;
};

/* Define the actual TodoListsContext Context */
export const TodoListsContext = createContext<TTodoListContext>({
  todoLists: [],
  setTodoLists: () => {},
});

/* Provide helper functions to use contexts */
export const useTodoItemsContext = () => useContext(TodoItemsContext);
export const useTodoListsContext = () => useContext(TodoListsContext);
