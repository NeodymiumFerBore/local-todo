import { Id, TTodoItem, TTodoList } from "@/types";

/**
 *
 * @param currentLists  All lists in state
 * @param targetListId  The list Id in which the item has to be added/altered
 * @param item  The TodoItem to work on
 * @returns  All lists in state, with updated item
 */
export function listsWithUpdatedItem(
  currentLists: TTodoList[],
  targetListId: Id,
  item: TTodoItem
): TTodoList[] {
  return currentLists.map((list) => {
    // Find the target list
    if (list.id === targetListId) {
      // Item already in list? Alter it
      if (list.items.find((e) => e.id === item.id)) {
        return {
          ...list,
          items: list.items.map((i) => {
            if (i.id === item.id) {
              return item;
            }
            return i;
          }),
        };
      }
      // Item not in list? Just add it
      return {
        ...list,
        items: [item, ...list.items],
      };
    }
    // Do not touch other lists
    return list;
  });
}

export function listsWithRemovedItem(
  currentLists: TTodoList[],
  targetListId: Id,
  targetItem: TTodoItem
): TTodoList[] {
  return currentLists.map((list) => {
    if (list.id === targetListId) {
      return {
        ...list,
        items: list.items.filter((e) => e.id !== targetItem.id),
      };
    }
    return list;
  });
}
