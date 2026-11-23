import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/geist";
import "@fontsource/pixelify-sans/600.css";
// Each project's section uses that project's own typefaces.
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/700.css";
import "@fontsource/marcellus/400.css";
import "@fontsource-variable/outfit";
import "@fontsource-variable/anybody";
import "@fontsource/alegreya-sans/400.css";
import "@fontsource/alegreya-sans/700.css";
import "@fontsource/press-start-2p/400.css";
import "@fontsource-variable/fraunces";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/nunito/600.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/figtree";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/source-sans-3";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
