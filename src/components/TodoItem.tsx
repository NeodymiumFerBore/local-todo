import { TTodoItem } from "@/types/index";

import { Checkbox, IconButton, ListItem, ListItemButton } from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { memo } from "react";

export type todoChangeEvent = "done" | "update";

interface Props {
  thisItem: TTodoItem;
  onChange?: (todo: Partial<TTodoItem>) => void;
  onDelete?: () => void;
}

function _TodoItem({ thisItem, onChange, onDelete }: Props) {
  function notifyDone() {
    onChange?.({ status: thisItem.status === "todo" ? "done" : "todo" });
  }

  function notifyDelete() {
    onDelete?.();
  }

  console.log("Rendering item", thisItem.id);
  return (
    <ListItem
      startAction={
        <Checkbox checked={thisItem.status === "done"} onChange={notifyDone} />
      }
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
      style={thisItem.status === "done" ? { opacity: 0.6 } : { opacity: 1 }}
    >
      <ListItemButton>{thisItem.name}</ListItemButton>
    </ListItem>
  );
}

export const TodoItem = memo<Props>(_TodoItem);
