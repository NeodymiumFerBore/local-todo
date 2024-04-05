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

export type TTodoItem = {
  id: Id;
  title: string;
  description: string;
  done: boolean;
};

export type TTodoList = {
  id: Id;
  title: string;
  description: string;
  items: TTodoItem[];
};

export type TBoard = DBObject & {
  name: string;
  description: string;
  selected: 0 | 1;
  viewOrder: number;
};

export type TViewOrder = DBObject & {
  type: "Board" | "TodoList" | "TodoItem";
  order: Id[];
};

function newDBObject(args: Partial<DBObject>): DBObject {
  const now = new Date();
  return {
    id: createId(args.id),
    whenCreated: args.whenCreated || now,
    whenModified: args.whenModified || now,
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
