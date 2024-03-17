import { useColorScheme } from "@mui/joy/styles";
import { IconButton } from "@mui/joy";
import { LightbulbOutlined, LightbulbRounded } from "@mui/icons-material";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      variant="solid"
      color="neutral"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? <LightbulbRounded /> : <LightbulbOutlined />}
    </IconButton>
  );
}
