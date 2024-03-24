import React, { CSSProperties, ReactElement } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import TodoItem from "./my-quote-item";
import type { TTodoItem, TTodoList } from "../types";
import { Box, List, Typography } from "@mui/joy";

interface Props {
  listId?: string;
  listType?: string;
  todos: TTodoItem[];
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
  todos: TTodoItem[];
}

function InnerTodoList(props: TodoListProps): ReactElement {
  return (
    <>
      <List>
        {props.todos.map((todo: TTodoItem, index: number) => (
          <Draggable key={todo.id.str} draggableId={todo.id.str} index={index}>
            {(
              dragProvided: DraggableProvided,
              dragSnapshot: DraggableStateSnapshot
            ) => (
              <TodoItem
                key={todo.id.str}
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
  todos: TTodoItem[];
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

export default function QuoteList(props: Props): ReactElement {
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
