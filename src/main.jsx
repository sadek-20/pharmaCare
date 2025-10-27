import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PharmacyProvider } from "./context/PharmacyContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PharmacyProvider>
        <App />
      </PharmacyProvider>
    </AuthProvider>
  </React.StrictMode>
);
