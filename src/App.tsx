import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/press-start-2p/400.css";
import { Route, Routes } from "react-router-dom";
import { Editor } from "./components/pages/Editor";
import { PaletteFixer } from "./components/pages/PaletteFixer";
import theme from "./theme";
import { useWebVitals } from "./webVitals";

function App() {
  if (import.meta.env.PROD) {
    useWebVitals();
  }

  return (
    <ChakraProvider theme={theme} resetCSS>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="palette" element={<PaletteFixer />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
