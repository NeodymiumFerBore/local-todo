import Dexie, {
  DBCore,
  DBCoreMutateRequest,
  DBCoreMutateResponse,
  DBCoreTable,
} from "dexie";
import { Config } from "./typings";

// Wrap original mutating request into doCascadeDelete
// Usage: doCascadeDelete(downlevelDatabase, req, table, config)
async function doCascadeDelete(
  core: DBCore,
  req: DBCoreMutateRequest,
  table: DBCoreTable,
  config: Config
): Promise<DBCoreMutateResponse> {
  // Not a deletion? Return
  if (req.type !== "delete") return await table.mutate(req);
  // Table has no FK? Return
  if (!Object.keys(config).includes(table.name)) return await table.mutate(req);

  const foreignTable = config[table.name];
  const childrenTable = core.table(foreignTable.rTableName);

  for (let key of req.keys) {
    const { result: childKeys } = await childrenTable.query({
      trans: req.trans,
      query: {
        index: childrenTable.schema.getIndexByKeyPath(foreignTable.rTableKey)!,
        range: {
          type: 1, // DBCoreRangeType.Equal
          lower: key,
          upper: key,
        },
      },
    });

    // Recursive call
    await doCascadeDelete(
      core,
      {
        type: "delete",
        trans: req.trans,
        keys: childKeys,
      },
      childrenTable,
      config
    );
  }

  return await table.mutate(req);
}

/**
 * @description From an intial stores array, return these stores + all stores
 *              referencing it, recursively.
 *              If table Boards is referenced by TodoLists, which is referenced
 *              by TodoItems, and initial input is ["Boards"], output will be
 *              ["Boards", "TodoLists", "TodoItems"].
 *              Necessary to override Dexie's transaction method, so all tables
 *              that need to be cascaded on are included in the transaction.
 * @param stores Dexie transaction store names array
 * @param config See typings.ts. Map of referenced tables and their referrer
 * @returns Input stores + all child referrers, recursively
 */
function aggregateCascadableStores(stores: string[], config: Config): string[] {
  let aggregatedStores = [...stores];

  // For each store
  stores.forEach((store) => {
    // Add the table refenrencing it, if any
    if (Object.keys(config).includes(store)) {
      aggregatedStores = [
        ...aggregatedStores,
        ...aggregateCascadableStores([config[store].rTableName], config),
      ];
    }
  });
  return [...new Set(aggregatedStores)];
}

export const cascadeDelete = (db: Dexie, config: Config) => {
  return db.use({
    stack: "dbcore",
    name: "CascadeDelete",
    create: (core) => ({
      ...core,
      transaction(stores, mode, ...rest) {
        if (mode === "readwrite") {
          const newStores = aggregateCascadableStores(stores, config);
          return core.transaction(newStores, mode, ...rest);
        }
        return core.transaction(stores, mode, ...rest);
      },
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          mutate: (req) => doCascadeDelete(core, req, table, config),
        };
      },
    }),
  });
};

cascadeDelete.setConfig = (config: Config) => (db: Dexie) =>
  cascadeDelete(db, config);
