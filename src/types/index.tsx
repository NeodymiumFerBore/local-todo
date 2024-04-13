export type Id = string & { _idBrand: "Id" };

function isId(id: string): id is Id {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    id
  );
}

export function createId(id?: string): Id {
  if (!id) {
    return crypto.randomUUID() as Id;
  }
  if (!isId(id)) {
    throw new Error("Invalid id format");
  }
  return id;
}

type DBObject = {
  id: Id;
  whenCreated: Date;
  whenModified: Date;
};

export type TTodoStatus = "todo" | "wip" | "done";

export type TTodoItem = DBObject & {
  name: string;
  listId: Id;
  content: string;
  status: TTodoStatus;
  viewOrder: number;
};

export type TTodoList = DBObject & {
  name: string;
  boardId: Id;
  description: string;
  viewOrder: number;
};

export type TBoard = DBObject & {
  name: string;
  description: string;
  selected: 0 | 1;
  viewOrder: number;
};

// https://github.com/Microsoft/TypeScript/issues/25760
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// All prop are optional but some of those are required
export type PartialWithRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;

function newDBObject(args: Partial<DBObject>): DBObject {
  const now = new Date();
  return {
    id: createId(args.id),
    whenCreated: args.whenCreated || now,
    whenModified: args.whenModified || now,
  };
}

type PartialTTodoItem = PartialWithRequired<TTodoItem, "listId">;
export function newTodoItem(args: PartialTTodoItem): TTodoItem {
  return {
    ...newDBObject(args),
    listId: args.listId,
    name: args.name || "Todo",
    content: args.content || "",
    status: args.status || "todo",
    viewOrder: args.viewOrder || 0,
  };
}

type PartialTTodoList = PartialWithRequired<TTodoList, "boardId">;
export function newTodoList(args: PartialTTodoList): TTodoList {
  return {
    ...newDBObject(args),
    boardId: args.boardId,
    name: args.name || "New List",
    description: args.description || "",
    viewOrder: args.viewOrder || 0,
  };
}

export function newBoard(args: Partial<TBoard> = {}): TBoard {
  return {
    ...newDBObject(args),
    name: args.name || "New Board",
    description: args.description || "",
    selected: args.selected || 0,
    viewOrder: args.viewOrder || -1,
  };
}
