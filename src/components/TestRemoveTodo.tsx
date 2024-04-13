import { useEffect, useRef, useState } from "react";

import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";

export function TestRemoveTodo() {
  const [tableId, setTableId] = useState("");

  const tables = useLiveQuery(() => db.todoLists.toArray(), [], []);
  const todos = useLiveQuery(
    () => db.todos.where({ listId: tableId }).toArray(),
    [tableId],
    []
  );

  const selectedTodoRef = useRef("");
  const initialTable = useRef(false);

  useEffect(() => {
    if (initialTable.current || tables.length === 0) return;
    console.log("Setting initial table ID");
    initialTable.current = true;
    setTableId(tables[0].id);
  }, [tables]);

  // Update selected todo ref when selected table changes
  useEffect(() => {
    if (todos.length === 0) {
      selectedTodoRef.current = "";
    } else {
      // If todos changed and current ref is not in todos,
      // then selected table changed and its todos were loaded
      if (todos.filter((e) => e.id === selectedTodoRef.current).length === 0)
        selectedTodoRef.current = todos[0].id;
    }
  }, [todos]);

  console.log("Rendering TestMoveTodo");
  return (
    <div style={{ padding: "10px", display: "flex" }}>
      <select onChange={(e) => setTableId(e.target.value)}>
        {tables.map((el) => (
          <option key={el.id} value={el.id}>
            {el.id}
          </option>
        ))}
      </select>
      <select onChange={(e) => (selectedTodoRef.current = e.target.value)}>
        {todos.map((el) => (
          <option key={el.id} value={el.id}>
            {el.id}
          </option>
        ))}
      </select>
      <button
        onClick={() => console.log(db.todos.delete(selectedTodoRef.current))}
      >
        Delete
      </button>
    </div>
  );
}
