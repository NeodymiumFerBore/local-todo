import { TBoard, TTodoItem, TTodoList } from "@/types";
import Dexie, { Table } from "dexie";
import {
  cascadeDelete,
  Config as CascadeConfig,
} from "./lib/cascadeDeleteAddon";

const cascadeConfig: CascadeConfig = {
  boards: {
    rTableName: "todoLists",
    rTableKey: "boardId",
  },
  todoLists: {
    rTableName: "todos",
    rTableKey: "listId",
  },
};

const _db = new Dexie("local-todo", {
  addons: [cascadeDelete.setConfig(cascadeConfig)],
}) as Dexie & {
  boards: Table<TBoard>;
  todoLists: Table<TTodoList>;
  todos: Table<TTodoItem>;
};

_db.version(1).stores({
  // Primary key and indexed props
  boards: "id, name, &viewOrder, selected",
  todoLists: "id, boardId, name, [boardId+viewOrder]",
  todos: "id, listId, status, [listId+viewOrder]",
});

export const db = _db;
