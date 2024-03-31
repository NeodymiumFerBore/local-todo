import { Close } from "@mui/icons-material";
import {
  Box,
  Input,
  Stack,
  Tab,
  TabProps,
  Typography,
  useTheme,
} from "@mui/joy";
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
  onDelete?: () => void;
};

function _EditableTab({
  initialName,
  onRename,
  onDelete,
  ...rest
}: EditableTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName || "");
  const inputRef = useRef<ElementRef<"input"> | undefined>();
  const theme = useTheme();

  useEffect(() => {
    /* eslint-disable react-hooks/exhaustive-deps */
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
        paddingLeft: "12px",
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
    <Tab
      {...rest}
      variant="soft"
      sx={{
        ...rest.sx,
        paddingLeft: "12px",
        paddingRight: onDelete ? "6px" : "12px",
      }}
      slotProps={{ root: { onDoubleClick: startEdit } }}
    >
      <Stack padding={0} direction={"row"} alignItems={"center"} spacing="6px">
        <Typography>{name}</Typography>
        {onDelete && (
          <Box
            onClick={onDelete}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="2px"
            sx={{
              borderRadius: "50%",
              ":hover": {
                backgroundColor: theme.vars.palette.neutral.plainHoverBg,
              },
            }}
          >
            <Close sx={{ height: "16px", width: "16px" }} />
          </Box>
        )}
      </Stack>
    </Tab>
  );
}

export const EditableTab = memo(_EditableTab);
