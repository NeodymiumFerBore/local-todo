import type { DraggableLocation } from "@hello-pangea/dnd";
import type { Quote, TodoItemMap } from "./types";

// a little function to help us with reordering the result
/**
 * @param list        list to reorder
 * @param startIndex  index of the item that was moved from
 * @param endIndex    index where the item was move to
 * @returns           reordered list
 */
function reorder<TItem>(
  list: TItem[],
  startIndex: number,
  endIndex: number
): TItem[] {
  // copy original list
  const result = [...list];
  // remove item at startIndex
  const [removed] = result.splice(startIndex, 1);
  // insert item at endIndex
  result.splice(endIndex, 0, removed);

  return result;
}

export default reorder;

interface ReorderTodoItemMapArgs {
  quoteMap: TodoItemMap;
  source: DraggableLocation;
  destination: DraggableLocation;
}

export interface ReorderTodoItemMapResult {
  quoteMap: TodoItemMap;
}

export const reorderTodoItemMap = ({
  quoteMap,
  source,
  destination,
}: ReorderTodoItemMapArgs): ReorderTodoItemMapResult => {
  const current: Quote[] = [...quoteMap[source.droppableId]];
  const next: Quote[] = [...quoteMap[destination.droppableId]];
  const target: Quote = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Quote[] = reorder(
      current,
      source.index,
      destination.index
    );
    const result: TodoItemMap = {
      ...quoteMap,
      [source.droppableId]: reordered,
    };
    return {
      quoteMap: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: TodoItemMap = {
    ...quoteMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    quoteMap: result,
  };
};
