import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasks/slice.js";
import authReducer from "./auth/slice.js";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default ?? storageModule;

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);

export default store;
