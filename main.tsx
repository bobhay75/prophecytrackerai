import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global error handlers for debugging
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
});

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find root element");
}

createRoot(container).render(<App />);
