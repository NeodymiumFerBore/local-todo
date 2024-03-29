import { Box, Button, Divider, Stack, Typography, useTheme } from "@mui/joy";
import { ThemeToggle } from "./ThemeToggle";

type NavBarProps = {
  onAddBoard?: () => void;
  onThemeClick?: () => void;
};

export function NavBar(props: NavBarProps) {
  // CSS: https://stackoverflow.com/a/68292664/8184810
  const theme = useTheme();
  return (
    <Box
      overflow="hidden"
      padding="4px"
      display="grid"
      alignItems="center"
      gridTemplateColumns="minmax(max-content, 1fr) auto minmax(max-content, 1fr)"
      sx={{ backgroundColor: theme.vars.palette.background.surface }}
    >
      <Box display="inline-block" padding="6px" justifySelf={"left"}>
        {/* Justified Left */}
        <Stack direction="row" alignItems="center" padding={0}>
          <Typography level="title-lg" paddingLeft="10px">
            Local Todo
          </Typography>
          <Divider
            orientation="vertical"
            sx={{ marginLeft: "20px", marginRight: "20px" }}
          />
          <Button>Add Board</Button>
        </Stack>
      </Box>
      <Box display="inline-block" padding="6px">
        {/* Centered */}
        <Button>Testing</Button>
      </Box>
      <Box display="inline-block" padding="6px" justifySelf={"right"}>
        {/* Justified right */}
        <ThemeToggle />
      </Box>
    </Box>
  );
}
