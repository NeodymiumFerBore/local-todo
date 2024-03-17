import { GUID, TTodoItem, TTodoList } from "@/types";

/**
 *
 * @param currentLists  All lists in state
 * @param targetListGuid  The list GUID in which the item has to be added/altered
 * @param item  The TodoItem to work on
 * @returns  All lists in state, with updated item
 */
export function listsWithUpdatedItem(
  currentLists: TTodoList[],
  targetListGuid: GUID,
  item: TTodoItem
): TTodoList[] {
  return currentLists.map((list) => {
    // Find the target list
    if (list.id.toString() === targetListGuid.toString()) {
      // Item already in list? Alter it
      if (list.items.find((e) => e.id.toString() === item.id.toString())) {
        return {
          ...list,
          items: list.items.map((i) => {
            if (i.id.toString() === item.id.toString()) {
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
  targetListGuid: GUID,
  targetItem: TTodoItem
): TTodoList[] {
  return currentLists.map((list) => {
    if (list.id.toString() === targetListGuid.toString()) {
      return {
        ...list,
        items: list.items.filter(
          (e) => e.id.toString() !== targetItem.id.toString()
        ),
      };
    }
    return list;
  });
}
