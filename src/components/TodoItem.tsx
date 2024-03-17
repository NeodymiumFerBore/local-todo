import { useTodoListsContext } from "@/contexts/Todo";
import { TTodoItem, GUID } from "@/types/index";
import {
  listsWithRemovedItem,
  listsWithUpdatedItem,
} from "@/helpers/todoLists";

import { Checkbox, IconButton, ListItem, ListItemButton } from "@mui/joy";
import { Delete } from "@mui/icons-material";

type Props = {
  ownerList: GUID;
  thisItem: TTodoItem;
};

export function TodoItem({ ownerList, thisItem }: Props) {
  const { todoLists, setTodoLists } = useTodoListsContext();

  function deleteTodo() {
    setTodoLists(listsWithRemovedItem(todoLists, ownerList, thisItem));
  }

  function toggleTodo(checked: boolean) {
    setTodoLists(
      listsWithUpdatedItem(todoLists, ownerList, {
        ...thisItem,
        done: checked,
      })
    );
  }

  return (
    <ListItem
      startAction={
        <Checkbox
          checked={thisItem.done}
          onChange={(e) => toggleTodo(e.target.checked)}
        />
      }
      endAction={
        <IconButton aria-label="Delete" size="sm" color="danger">
          <Delete onClick={deleteTodo} />
        </IconButton>
      }
      style={thisItem.done ? { opacity: 0.6 } : { opacity: 1 }}
    >
      <ListItemButton>{thisItem.title}</ListItemButton>
    </ListItem>
  );
}
