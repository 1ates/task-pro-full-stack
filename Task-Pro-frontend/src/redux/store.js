import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice.js";
import boardsReducer from "./boards/slice.js";
import columnsReducer from "./columns/slice.js";
import cardsReducer from "./cards/slice.js";
import filtersReducer from "./filters/slice.js";
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
    boards: boardsReducer,
    columns: columnsReducer,
    cards: cardsReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);

export default store;
