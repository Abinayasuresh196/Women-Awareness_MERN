import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
// Redux
import { Provider } from "react-redux";
import store from "./app/store";

// Import all styles
import "./all-styles.css"; // Comprehensive CSS import
import "swiper/css"; // swiper styles for carousel
import "swiper/css/pagination";
import "swiper/css/navigation";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
