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

export type TBoard = {
  id: Id;
  title: string;
  description: string;
  whenCreated: Date;
  whenModified: Date;
};

export function newBoard(args: Partial<TBoard>): TBoard {
  const now = new Date();
  return {
    id: createId(args.id),
    title: args.title || "",
    description: args.description || "",
    whenCreated: args.whenCreated || now,
    whenModified: args.whenModified || now,
  };
}
