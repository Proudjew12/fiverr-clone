import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/main.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(<App />);
