import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./app/App";
import { DemoStoreProvider } from "./hooks/useDemoStore";
import { ToastProvider } from "./components/common/Toast";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <DemoStoreProvider>
          <App />
        </DemoStoreProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>
);
