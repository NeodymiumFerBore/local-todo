import { Input, Tab, TabProps, Typography } from "@mui/joy";
import {
  BaseSyntheticEvent,
  ElementRef,
  FormEvent,
  RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type EditableTabProps = TabProps & {
  initialName?: string;
  onRename?: (s: string) => void;
};

function _EditableTab({ initialName, onRename, ...rest }: EditableTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName || "");
  const inputRef = useRef<ElementRef<"input"> | undefined>();

  useEffect(() => {
    onRename?.(name);
  }, [name]);

  const startEdit = useCallback((e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsEditing(true);
  }, []);

  const endEdit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setName((curr) => {
      return inputRef.current?.value || curr;
    });
  }, []);

  console.log("Rendering tab", name);
  return isEditing ? (
    <Tab
      {...rest}
      sx={{
        ...rest.sx,
        paddingTop: 0,
        paddingBottom: 0,
        ":focus-visible": { color: "transparent" },
        "&.Mui-selected": { outline: "none" },
      }}
    >
      <form onSubmit={endEdit}>
        <Input
          slotProps={{
            input: { ref: inputRef as RefObject<HTMLInputElement> },
          }}
          sx={{
            backgroundColor: "transparent",
            padding: 0,
            "--Input-focusedThickness": "0px",
          }}
          variant="plain"
          autoFocus={isEditing}
          onBlur={endEdit}
          defaultValue={name}
        />
      </form>
    </Tab>
  ) : (
    <Tab {...rest} sx={{ ...rest.sx, "&.Mui-selected": { outline: "none" } }}>
      <div
        onDoubleClick={startEdit}
        children={<Typography level="body-md">{name}</Typography>}
      />
    </Tab>
  );
}

export const EditableTab = memo(_EditableTab);
