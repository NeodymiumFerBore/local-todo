import { Id, TTodoItem } from "@/types/index";

import { Checkbox, IconButton, ListItem, ListItemButton } from "@mui/joy";
import { Delete } from "@mui/icons-material";
import { memo, useCallback } from "react";

type Props = {
  thisItem: TTodoItem;
  // onChange?: (todo: Partial<TTodoItem>) => void;
  onDelete?: (id: Id) => void;
};

function _TodoItem(props: Props) {
  const { thisItem, onDelete } = props;

  // const notifyDone = useCallback(() => {
  //   onChange?.({ status: thisItem.status === "todo" ? "done" : "todo" });
  // }, [thisItem.status, onChange]);

  const emitOnDelete = useCallback(() => {
    onDelete?.(thisItem.id);
  }, [thisItem.id]);

  console.log("Rendering item", thisItem.id);
  return (
    <ListItem
      startAction={
        // <Checkbox checked={thisItem.status === "done"} onChange={notifyDone} />
        <Checkbox checked={thisItem.status === "done"} />
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
