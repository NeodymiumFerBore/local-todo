import { useState } from "react";
import type {
  DropResult,
  DraggableLocation,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { TodoItemMap, Todo } from "../types";
import Column from "./MyColumn";
import reorder, { reorderTodoItemMap } from "../reorder";
import { PartialAutoScrollerOptions } from "@hello-pangea/dnd/src/state/auto-scroller/fluid-scroller/auto-scroller-options-types";
import { Stack } from "@mui/joy";

interface Props {
  initial: TodoItemMap;
  onChange?: (todos: TodoItemMap) => void;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  useClone?: boolean;
  autoScrollerOptions?: PartialAutoScrollerOptions;
}

export default function Board(props: Props) {
  const [todos, setTodos] = useState(props.initial);
  const [ordered, setOrdered] = useState(Object.keys(props.initial));

  function onDragEnd(result: DropResult): void {
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow: string[] = [...ordered];
        shallow.splice(result.source.index, 1);
        setOrdered(shallow);
        return;
      }

      const column: Todo[] = todos[result.source.droppableId];
      const withTodoRemoved: Todo[] = [...column];
      withTodoRemoved.splice(result.source.index, 1);
      const columns: TodoItemMap = {
        ...todos,
        [result.source.droppableId]: withTodoRemoved,
      };
      setTodos(columns);
      return;
    }

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

    // reordering todos
    const data = reorderTodoItemMap({
      todoItemMap: todos,
      source,
      destination,
    });

    setTodos(data.todoItemMap);
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
                title={key}
                todos={todos[key]}
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
