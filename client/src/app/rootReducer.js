import { combineReducers } from "@reduxjs/toolkit";

// Import slice reducers
import authReducer from "../features/auth/authSlice";
import lawReducer from "../features/laws/lawSlice";
import schemeReducer from "../features/schemes/schemeSlice";
import articleReducer from "../features/articles/articleSlice";

// Combine all slices
const rootReducer = combineReducers({
  auth: authReducer,
  laws: lawReducer,
  schemes: schemeReducer,
  articles: articleReducer,
});

export default rootReducer;
