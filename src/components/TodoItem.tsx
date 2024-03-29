import { TTodoItem } from "@/types/index";

import { Checkbox, IconButton, ListItem, ListItemButton } from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { memo } from "react";

export type todoChangeEvent = "done" | "update";

interface Props {
  thisItem: TTodoItem;
  onChange?: (id: string, type: todoChangeEvent) => void;
  onDelete?: (id: string) => void;
}

function _TodoItem({ thisItem, onChange, onDelete }: Props) {
  function notifyDone() {
    onChange?.(thisItem.id, "done");
  }

  function notifyDelete() {
    onDelete?.(thisItem.id);
  }

  console.log("Rendering item", thisItem.id);
  return (
    <ListItem
      startAction={<Checkbox checked={thisItem.done} onChange={notifyDone} />}
      endAction={
        <IconButton
          aria-label="Delete"
          size="sm"
          color="danger"
          onClick={notifyDelete}
        >
          <Delete />
        </IconButton>
      }
      style={thisItem.done ? { opacity: 0.6 } : { opacity: 1 }}
    >
      <ListItemButton>{thisItem.title}</ListItemButton>
    </ListItem>
  );
}

export const TodoItem = memo<Props>(_TodoItem);
