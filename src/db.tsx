import { TBoard, TTodoItem, TTodoList } from "@/types";
import Dexie, { Table } from "dexie";

class LocalTodoDB extends Dexie {
  // Tables are added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  boards!: Table<TBoard>;
  todoLists!: Table<TTodoList>;
  todos!: Table<TTodoItem>;

  constructor() {
    super("local-todo");
    this.version(1).stores({
      // Primary key and indexed props
      boards: "id, name, &viewOrder, selected",
      todoLists: "id, boardId, name, [boardId+viewOrder]",
      todos: "id, listId",
    });
  }
}

export const db = new LocalTodoDB();
