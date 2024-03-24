import React, { CSSProperties, ReactElement } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import TodoItem from "./TodoItem";
import type { Todo } from "../types";
import { Box, List, Typography } from "@mui/joy";

interface Props {
  listId?: string;
  listType?: string;
  todos: Todo[];
  title?: string;
  internalScroll?: boolean;
  scrollContainerStyle?: CSSProperties;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: CSSProperties;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
  useClone?: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

function InnerTodoList(props: TodoListProps): ReactElement {
  return (
    <>
      <List>
        {props.todos.map((todo: Todo, index: number) => (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(
              dragProvided: DraggableProvided,
              dragSnapshot: DraggableStateSnapshot
            ) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isDragging={dragSnapshot.isDragging}
                isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                provided={dragProvided}
              />
            )}
          </Draggable>
        ))}
      </List>
    </>
  );
}

const InnerTodoListMemo = React.memo<TodoListProps>(InnerTodoList);

interface InnerListProps {
  dropProvided: DroppableProvided;
  todos: Todo[];
  title: string | undefined | null;
}

function InnerList(props: InnerListProps) {
  const { todos, dropProvided } = props;
  const title = props.title ? (
    <Typography level="title-md">{props.title}</Typography>
  ) : null;

  return (
    <Box>
      {title}
      <Box
        sx={{ margin: 0, padding: 0, border: 0 }}
        ref={dropProvided.innerRef}
      >
        <InnerTodoListMemo todos={todos} />
        {dropProvided.placeholder}
      </Box>
    </Box>
  );
}

export default function TodoList(props: Props): ReactElement {
  const {
    ignoreContainerClipping,
    isDropDisabled,
    isCombineEnabled,
    listId = "LIST",
    listType,
    todos,
    title,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, descriptor) => (
              <TodoItem
                todo={todos[descriptor.source.index]}
                provided={provided}
                isDragging={snapshot.isDragging}
              />
            )
          : undefined
      }
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <InnerList todos={todos} title={title} dropProvided={dropProvided} />
      )}
    </Droppable>
  );
}

// export default React.memo<Props>(TodoList);
