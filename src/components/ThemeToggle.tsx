import { useColorScheme } from "@mui/joy/styles";
import { IconButton } from "@mui/joy";
import { LightbulbOutlined, LightbulbRounded } from "@mui/icons-material";

export function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();

  function effectiveMode() {
    if (mode === "dark" || (mode === "system" && systemMode === "dark"))
      return "dark";
    else return "light";
  }

  return (
    <IconButton
      variant="plain"
      color="neutral"
      onClick={() => setMode(effectiveMode() === "dark" ? "light" : "dark")}
    >
      {effectiveMode() === "dark" ? (
        <LightbulbRounded />
      ) : (
        <LightbulbOutlined />
      )}
    </IconButton>
  );
}
