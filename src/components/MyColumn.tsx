import { Draggable } from "@hello-pangea/dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import TodoList from "../primatives/my-quote-list";
import type { Todo } from "../types";
import AddIcon from "@mui/icons-material/Add";

import {
  Button,
  Card,
  CardOverflow,
  Container,
  Input,
  Typography,
} from "@mui/joy";
import React, { useRef } from "react";

interface Props {
  title: string;
  quotes: Todo[];
  index: number;
  isScrollable?: boolean;
  isCombineEnabled?: boolean;
  useClone?: boolean;
}

export default function Column(props: Props) {
  const title: string = props.title;
  const quotes: Todo[] = props.quotes;
  const index: number = props.index;
  const itemRef = useRef<React.ElementRef<"input"> | undefined>();

  function addTodoItem(e: React.FormEvent) {
    e.preventDefault();
    console.log("Adding new todo: ", itemRef.current?.value);
  }

  return (
    <Draggable draggableId={title} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Card
            sx={{
              maxWidth: 360,
              opacity:
                snapshot.isDragging && !snapshot.isDropAnimating ? 0.85 : 1,
            }}
          >
            <CardOverflow>
              <Typography
                level="title-lg"
                {...provided.dragHandleProps}
                sx={{ paddingTop: 2 }}
              >
                {title}
              </Typography>
            </CardOverflow>
            <form onSubmit={addTodoItem}>
              <Input
                slotProps={{
                  input: { ref: itemRef as React.RefObject<HTMLInputElement> },
                }}
                required
                placeholder="Add a task..."
                endDecorator={
                  <Button type="submit">
                    <AddIcon />
                  </Button>
                }
              />
            </form>
            <TodoList
              listId={title}
              listType="QUOTE"
              style={{
                backgroundColor: snapshot.isDragging ? "#bbbbbb" : "#eeeeee",
              }}
              quotes={quotes}
              internalScroll={props.isScrollable}
              isCombineEnabled={Boolean(props.isCombineEnabled)}
              useClone={Boolean(props.useClone)}
            />
          </Card>
        </Container>
      )}
    </Draggable>
  );
}
