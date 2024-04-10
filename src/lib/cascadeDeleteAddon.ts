// From https://github.com/dexie/Dexie.js/issues/1709
import Dexie, {
  DBCore,
  DBCoreMutateRequest,
  DBCoreMutateResponse,
  DBCoreTable,
} from "dexie";

// Wrap original mutating request into cascadeDelete
// Usage: cascadeDelete(downlevelDatabase, req, table)
async function doCascadeDelete(
  core: DBCore,
  req: DBCoreMutateRequest,
  table: DBCoreTable
): Promise<DBCoreMutateResponse> {
  const foreignMap = {
    // Keys are tables having a foreign key
    boards: {
      // Name of the foreign table
      fTableName: "todoLists",
      // The key name to look for in foreign key
      fTableKey: "boardId",
    },
    todoLists: {
      fTableName: "todos",
      fTableKey: "listId",
    },
  };
  // Not a deletion? Return
  if (req.type !== "delete") return await table.mutate(req);
  // Table has no FK? Return
  if (!Object.keys(foreignMap).includes(table.name))
    return await table.mutate(req);

  const foreignTable = foreignMap[table.name as keyof typeof foreignMap];
  const childrenTable = core.table(foreignTable.fTableName);

  for (let key of req.keys) {
    const { result: childKeys } = await childrenTable.query({
      trans: req.trans,
      query: {
        index: childrenTable.schema.getIndexByKeyPath(foreignTable.fTableKey)!,
        range: {
          type: 1, // DBCoreRangeType.Equal
          lower: key,
          upper: key,
        },
      },
    });

    // The recursive call appears to be key
    await doCascadeDelete(
      core,
      {
        type: "delete",
        trans: req.trans,
        keys: childKeys,
      },
      childrenTable
    );
  }

  return await table.mutate(req);
}

export const cascadeDelete = (db: Dexie) => {
  return db.use({
    stack: "dbcore",
    name: "cascadeDelete",
    create: (core) => ({
      ...core,
      transaction(stores, mode, ...rest) {
        if (mode === "readwrite") {
          let newStores: string[] = [];
          // If read/write on todoLists, we need todos for CASCADE deletion
          if (stores.includes("todoLists"))
            newStores = [...new Set([...stores, "todos"])];
          // If read/write on boards, we need lists and todos for CASCADE deletion
          if (stores.includes("boards"))
            newStores = [...new Set([...stores, "todoLists", "todos"])];
          return core.transaction(newStores, mode, ...rest);
        }
        return core.transaction(stores, mode, ...rest);
      },
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          mutate: (req) => doCascadeDelete(core, req, table),
        };
      },
    }),
  });
};
