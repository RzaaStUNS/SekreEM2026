import axios from "axios";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(<App />);
