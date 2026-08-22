import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import store, { persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./components/App/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename='/task-pro'>
          <App />
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 4000,
            }}
          />
        </BrowserRouter>{" "}
      </PersistGate>
    </Provider>
  </StrictMode>,
);
