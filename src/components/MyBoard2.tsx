import React, { memo, useEffect, useState } from "react";
import type {
  DropResult,
  DraggableLocation,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { TodoItemMap, Todo, TTodoList } from "../types";
import Column from "./MyColumn";
import reorder, { reorderTodoItemMap } from "../reorder";
import { PartialAutoScrollerOptions } from "@hello-pangea/dnd/src/state/auto-scroller/fluid-scroller/auto-scroller-options-types";
import { Stack } from "@mui/joy";
import { generateTodoItemMap, generateTodoItemMapFromData } from "./data";

interface Props {
  todos: Todo[];
  todoLists: TTodoList[];
  onTodosChange: (todos: Todo[]) => void;
  onTodoListsChange: (todoLists: TTodoList[]) => void;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  useClone?: boolean;
  autoScrollerOptions?: PartialAutoScrollerOptions;
}

export function Board(props: Props) {
  const todos = props.todos;
  const onTodosChange = props.onTodosChange;

  const todoLists = props.todoLists;
  const onTodoListsChange = props.onTodoListsChange;

  const [todoMap, setTodoMap] = useState(
    generateTodoItemMapFromData(todos, todoLists)
  );
  const [ordered, setOrdered] = useState(Object.keys(todoMap));

  useEffect(() => {
    console.log("MyBoard2: updating todoMap");
    // setTodoMap(generateTodoItemMapFromData(todos, todoLists));
    // setOrdered((curr: string[]) => {
    //   return [
    //     ...curr,
    //     ...Object.keys(todoMap).filter((e) => !curr.includes(e)),
    //   ];
    // });
    // console.log(ordered);
  }, [todos, todoLists]);

  function onDragEnd(result: DropResult): void {
    // if (result.combine) {
    //   if (result.type === "COLUMN") {
    //     const shallow: string[] = [...ordered];
    //     shallow.splice(result.source.index, 1);
    //     setOrdered(shallow);
    //     return;
    //   }

    //   const column: Todo[] = todos[result.source.droppableId];
    //   const withTodoRemoved: Todo[] = [...column];
    //   withTodoRemoved.splice(result.source.index, 1);
    //   const columns: TodoItemMap = {
    //     ...todos,
    //     [result.source.droppableId]: withTodoRemoved,
    //   };
    //   setTodos(columns);
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

    // reordering todos
    const data = reorderTodoItemMap({
      todoItemMap: todoMap,
      source,
      destination,
    });

    setTodoMap(data.todoItemMap);
    onTodosChange(Object.values(data.todoItemMap).flat());
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
                todos={todoMap[key]}
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

export default React.memo<Props>(Board);
