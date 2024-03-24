import React from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { Quote } from "../types";
import {
  Checkbox,
  IconButton,
  ListDivider,
  ListItem,
  ListItemButton,
} from "@mui/joy";
import { Delete } from "@mui/icons-material";

interface Props {
  quote: Quote;
  isDragging: boolean;
  provided: DraggableProvided;
  isGroupedOver?: boolean;
}

export function QuoteItem(props: Props) {
  const { quote, isDragging, isGroupedOver, provided } = props;

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <ListItem
        startAction={
          <Checkbox />
          // checked={thisItem.done}
          // onChange={(e) => toggleTodo(e.target.checked)}
          // />
        }
        endAction={
          <IconButton aria-label="Delete" size="sm" color="danger">
            <Delete
            // onClick={deleteTodo}
            />
          </IconButton>
        }
        // style={thisItem.done ? { opacity: 0.6 } : { opacity: 1 }}
      >
        <ListItemButton>{quote.content}</ListItemButton>
      </ListItem>
      <ListDivider inset="gutter" />
    </div>
  );
}

export default React.memo<Props>(QuoteItem);
// export default QuoteItem;
