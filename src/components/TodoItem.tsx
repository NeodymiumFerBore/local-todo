import { Id, PartialWithRequired, TTodoItem } from "@/types/index";

import { Checkbox, IconButton, ListItem, ListItemButton } from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { memo, useCallback } from "react";

type Props = {
  thisItem: TTodoItem;
  onChange?: (todo: PartialWithRequired<TTodoItem, "id">) => void;
  onDelete?: (id: Id) => void;
};

function _TodoItem(props: Props) {
  const { thisItem, onChange, onDelete } = props;

  const emitStatus = useCallback(() => {
    onChange?.({
      id: thisItem.id,
      status: thisItem.status === "todo" ? "done" : "todo",
    });
  }, [thisItem.id, thisItem.status, onChange]);

  const emitOnDelete = useCallback(() => {
    onDelete?.(thisItem.id);
  }, [thisItem.id, onDelete]);

  console.log("Rendering item", thisItem.id);
  return (
    <ListItem
      startAction={
        <Checkbox checked={thisItem.status === "done"} onChange={emitStatus} />
      }
      endAction={
        <IconButton
          aria-label="Delete"
          size="sm"
          color="danger"
          onClick={emitOnDelete}
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
