import "./styles.css";
import { CssVarsProvider, Stack } from "@mui/joy";
import { NavBar } from "./components/NavBar";
import Board from "./components/Board";

export default function App() {
  return (
    <>
      <CssVarsProvider defaultMode="system">
        <NavBar />
        <Stack sx={{ alignItems: "center" }}>
          <Board sx={{}} />
        </Stack>
      </CssVarsProvider>
    </>
  );
}
