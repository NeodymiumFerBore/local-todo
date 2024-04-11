/**
 * Example Config:
 * const foreignMap = {
    boards: {
      rTableName: "todoLists",
      rTableKey: "boardId",
    },
    todoLists: {
      rTableName: "todos",
      rTableKey: "listId",
    },
  };
 */

export type Config = {
  // Table being reference by another table
  [key: string]: {
    // Name of the table referencing it, that should be CASCADED on
    rTableName: string;
    // The key name to look for (FK)
    rTableKey: string;
  };
};
