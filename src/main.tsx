import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router";
import App from "./App";

// Bundled from node_modules — no CDN, no network at runtime.
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-serif/latin-400.css";
import "./styles/index.css";

/*
 * In the packaged desktop app the frontend is served from a custom protocol with no
 * server-side routing, so reloading on a sub-path would 404. Hash routes survive that.
 * The browser keeps clean paths.
 */
const inTauri = "__TAURI_INTERNALS__" in window;
const Router = inTauri ? HashRouter : BrowserRouter;

const container = document.getElementById("root");
if (!container) throw new Error("#root is missing from index.html");

createRoot(container).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
