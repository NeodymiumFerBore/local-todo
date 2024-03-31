import "./styles.css";
import { CssVarsProvider } from "@mui/joy";
import { NavBar } from "./components/NavBar";
import { TabBoardsView } from "./components/TabBoardsView";

export default function App() {
  return (
    <>
      <CssVarsProvider defaultMode="system">
        <NavBar />
        <TabBoardsView />
      </CssVarsProvider>
    </>
  );
}
