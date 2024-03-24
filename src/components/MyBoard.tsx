import { useState } from "react";
import type {
  DropResult,
  DraggableLocation,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { TTodoList, TTodoItem, TodoListMap } from "../types";
import Column from "./MyColumn";
import reorder, { reorderQuoteMap } from "../reorder";
import { PartialAutoScrollerOptions } from "@hello-pangea/dnd/src/state/auto-scroller/fluid-scroller/auto-scroller-options-types";
import { Stack } from "@mui/joy";
import { getTodoListsIDs } from "@/helpers/todoLists";

interface Props {
  initial: TodoListMap;
  onChange?: (todoLists: TodoListMap) => void;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  useClone?: boolean;
  autoScrollerOptions?: PartialAutoScrollerOptions;
}

export default function Board(props: Props) {
  const [todoLists, setTodoLists] = useState(props.initial);
  const [ordered, setOrdered] = useState(Object.keys(props.initial));

  function onDragEnd(result: DropResult): void {
    // if (result.combine) {
    //   if (result.type === "COLUMN") {
    //     const shallow: string[] = [...ordered];
    //     shallow.splice(result.source.index, 1);
    //     setOrdered(shallow);
    //     return;
    //   }

    //   // const column: TTodoList = quotes[result.source.droppableId];
    //   const column: TTodoList = todoLists.find(
    //     (e) => e.id.str === result.source.droppableId
    //   )!;
    //   const withQuoteRemoved: Quote[] = [...column];
    //   withQuoteRemoved.splice(result.source.index, 1);
    //   const columns: QuoteMap = {
    //     ...quotes,
    //     [result.source.droppableId]: withQuoteRemoved,
    //   };
    //   setQuotes(columns);
    //   return;
    // }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const reordered: string[] = reorder(
        ordered,
        source.index,
        destination.index
      );
      setOrdered(reordered);
      return;
    }

    // reordering quotes
    const data = reorderQuoteMap({
      todoListMap: todoLists,
      source,
      destination,
    });

    setTodoLists(data.todoListMap);
  }

  return (
    // const board = (
    <DragDropContext
      onDragEnd={onDragEnd}
      autoScrollerOptions={props.autoScrollerOptions}
    >
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(props.containerHeight)}
        isCombineEnabled={props.isCombineEnabled}
      >
        {(provided: DroppableProvided) => (
          <Stack
            direction="row"
            alignSelf="center"
            width="fit-content"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {ordered.map((key: string, index: number) => (
              <Column
                key={key}
                index={index}
                todoList={todoLists[key]}
                isScrollable={props.withScrollableColumns}
                isCombineEnabled={props.isCombineEnabled}
                useClone={props.useClone}
              />
            ))}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
}
