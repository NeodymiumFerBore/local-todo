# CASCADE delete addon for Dexie

Greatly inspired by [FelixZY comment in Dexie#1709](https://github.com/dexie/Dexie.js/issues/1709#issuecomment-1593598955).

## Usage

In this example, deleting an entry from table `todoLists` will delete all entries in
`todoItems` where `todoItems.listId` == `deletedTodoList.id`. You don't need to include the
child stores in your original transaction.

```ts
import Dexie, { Table } from "dexie";
import { cascadeDelete, Config } from "@/lib/cascadeDeleteAddon";

// Deleting a todoList should delete all child todoItems
const config: Config = {
  // Keys are tables being reference by another table
  todoLists: {
    // Name of the table referencing it, that should be CASCADED on
    rTableName: "todoItems",
    // The key name to look for (FK)
    rTableKey: "listId",
  },
};

const db = new Dexie("MyTodoLists", {
  addons: [cascadeDelete.setConfig(config)],
}) as Dexie & {
  todoLists: Table<{
    id: number;
  }>;
  todoItems: Table<{
    id: number;
    listId: number; // References listId
  }>;
};

db.version(1).stores({
  todoLists: "id",
  todoItems: "id, listId",
});

await db.todoLists.bulkAdd([{ id: 1 }, { id: 2 }]);
await db.todoItems.bulkAdd([
  { id: 1, listId: 1 },
  { id: 2, listId: 1 },
  { id: 3, listId: 2 },
  { id: 4, listId: 2 },
  { id: 5, listId: 2 },
]);

// This will delete 1 todoList and 2 todoItems
db.todoLists.delete(1);

// This will only delete 1 todoItem
db.todoItems.delete(4);

// This will delete 1 todoList and 2 remaining todoItems
db.todoLists.delete(2);

// Database is now empty
```

## Limitations and drawbacks

- Any readwrite operation on any table that has a foreign key will make the foreign tables to
  be locked (added to transaction stores), _even if the operation is not a deletion_.
- This addon has not been tested on `deleteRange` operations, and has not been implemented
  with it in mind. It's very likely to **not** work.
- As of now, **only 1 foreign reference by table is supported**. If your table is referenced
  by more than 1 table, this addon will not help you. However, you are welcome to help the
  addon :)

## FAQ

### Why do I have to explicitly configure the addon with all relations?

TL;DR: the addon cannot guess by itself which tables should be added to the transaction,
nor what are the foreign keys to look for in these tables. That's why you have to explicitly
define which tables are referenced, by which table, with which key.

Full explanation: a transaction must include all object stores it involves. This addon offers
a way to cascade delete items from another table in a transparent way. So, in
[the given example](#usage), you don't have to explicitly make a transaction and manually
include `todoItems`:

```ts
// Without this addon
db.transaction("rw", db.todoLists, db.todoItems, () => {
  db.todoItems.where({ listId: 1 }).delete();
  db.todoLists.delete(1);
});

// With this addon
db.todoLists.delete(1);
```

This addon overrides Dexie's `transaction`, and adds the required "child" stores to the
current transaction. It then overrides the `table.mutate` function on `delete` operations,
so it actually does the cascade.

However, the addon cannot guess by itself which tables should be added to the transaction,
nor what are the foreign keys to look for in these tables. That's why you have to explicitly
tell it which tables are referenced, by which table, with which key.

### Does this work at more than 1 relation levels?

TO TEST
