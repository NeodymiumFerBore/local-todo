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

function TodoItem({
  thisItem,
  onChange = (_, __) => {},
  onDelete = (_) => {},
}: Props) {
  function notifyDone() {
    onChange(thisItem.id.toString(), "done");
  }

  function notifyDelete() {
    onDelete(thisItem.id.toString());
  }

  return (
    <ListItem
      startAction={<Checkbox checked={thisItem.done} onChange={notifyDone} />}
      endAction={
        <IconButton aria-label="Delete" size="sm" color="danger">
          <Delete onClick={notifyDelete} />
        </IconButton>
      }
      style={thisItem.done ? { opacity: 0.6 } : { opacity: 1 }}
    >
      <ListItemButton>{thisItem.title}</ListItemButton>
    </ListItem>
  );
}

export default memo<Props>(TodoItem);
