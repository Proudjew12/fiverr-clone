import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BackendWarmupGate } from "./components/ui/BackendWarmupGate.jsx";
import "./style/main.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <BackendWarmupGate>
    <App />
  </BackendWarmupGate>
);
