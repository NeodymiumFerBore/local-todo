import { TBoard, TTodoItem, TTodoList } from "@/types";
import Dexie, { Table } from "dexie";
import { cascadeDelete } from "./lib/cascadeDeleteMiddleware";

const _db = new Dexie("local-todo", {
  addons: [cascadeDelete],
}) as Dexie & {
  boards: Table<TBoard>;
  todoLists: Table<TTodoList>;
  todos: Table<TTodoItem>;
};

_db.version(1).stores({
  // Primary key and indexed props
  boards: "id, name, &viewOrder, selected",
  todoLists: "id, boardId, name, [boardId+viewOrder]",
  todos: "id, listId",
});

export const db = _db;
