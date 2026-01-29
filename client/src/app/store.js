import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // avoids warnings for non-serializable data like files
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
