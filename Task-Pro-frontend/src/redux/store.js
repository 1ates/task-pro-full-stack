import { configureStore } from "@reduxjs/toolkit";
// NOT: "./tasks/slice.js" projede yok (boards/cards/columns var).
// Bu satir build'i tamamen kirdigi icin kaldirildi.
// TODO: boards/cards/columns reducer'lari hazir olunca buraya eklenmeli.
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store);

export default store;
