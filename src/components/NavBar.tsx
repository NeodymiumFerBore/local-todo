import { Box, Button, Divider, Stack, Typography, useTheme } from "@mui/joy";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
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
      <Box display="inline-block" justifySelf={"left"}>
        {/* Justified Left */}
        <Stack direction="row" alignItems="center">
          <Typography level="title-lg" paddingLeft="20px" paddingRight={"20px"}>
            Local Todo
          </Typography>
          {/* <Divider orientation="vertical" /> */}
        </Stack>
      </Box>
      <Box display="inline-block" padding="6px">
        {/* Centered */}
      </Box>
      <Box display="inline-block" padding="6px" justifySelf={"right"}>
        {/* Justified right */}
        <ThemeToggle />
        <IconButton
          component="a"
          aria-label="GitHub"
          target="_blank"
          href="https://github.com/NeodymiumFerBore/local-todo"
        >
          <GitHub />
        </IconButton>
      </Box>
    </Box>
  );
}
