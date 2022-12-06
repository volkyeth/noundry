import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "@fontsource/press-start-2p/400.css";
import { Route, Routes } from "react-router-dom";
import { Editor } from "./components/pages/Editor";
import { PaletteFixer } from "./components/pages/PaletteFixer";
import theme from "./theme";
import { useWebVitals } from "./webVitals";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  if (import.meta.env.PROD) {
    useWebVitals();
  }

  const queryClient = new QueryClient();

  return (
    <ChakraProvider theme={theme} resetCSS>
      <QueryClientProvider client={queryClient}>
        <ColorModeScript initialColorMode={"dark"} />
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="palette" element={<PaletteFixer />} />
        </Routes>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
