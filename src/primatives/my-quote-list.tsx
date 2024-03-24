import React, { CSSProperties, ReactElement } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import QuoteItem from "./my-quote-item";
import type { Todo } from "../types";
import { Box, List, Typography } from "@mui/joy";

interface Props {
  listId?: string;
  listType?: string;
  quotes: Todo[];
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

interface QuoteListProps {
  quotes: Todo[];
}

function InnerQuoteList(props: QuoteListProps): ReactElement {
  return (
    <>
      <List>
        {props.quotes.map((quote: Todo, index: number) => (
          <Draggable key={quote.id} draggableId={quote.id} index={index}>
            {(
              dragProvided: DraggableProvided,
              dragSnapshot: DraggableStateSnapshot
            ) => (
              <QuoteItem
                key={quote.id}
                quote={quote}
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

const InnerQuoteListMemo = React.memo<QuoteListProps>(InnerQuoteList);

interface InnerListProps {
  dropProvided: DroppableProvided;
  quotes: Todo[];
  title: string | undefined | null;
}

function InnerList(props: InnerListProps) {
  const { quotes, dropProvided } = props;
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
        <InnerQuoteListMemo quotes={quotes} />
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
    quotes,
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
              <QuoteItem
                quote={quotes[descriptor.source.index]}
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
        <InnerList quotes={quotes} title={title} dropProvided={dropProvided} />
      )}
    </Droppable>
  );
}
