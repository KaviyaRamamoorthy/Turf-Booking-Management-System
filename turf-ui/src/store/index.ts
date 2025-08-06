import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { RootState } from "../types";

// Import slices
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import turfReducer from "./slices/turfSlice";
import bookingReducer from "./slices/bookingSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import adminBookingReducer from "./slices/adminBookingSlice";
import categoryReducer from "./slices/categorySlice";

// Transform to exclude loading states from persistence
const authTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState: any) => {
    // Remove loading and error states from persistence
    const { isLoading, error, ...rest } = inboundState;
    return rest;
  },
  // transform state being rehydrated
  (outboundState: any) => {
    // Ensure loading and error states are reset on rehydration
    return {
      ...outboundState,
      isLoading: false,
      error: null,
    };
  },
  // define which reducer this transform gets called for
  { whitelist: ["auth"] }
);

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui", "category"], // Persist auth, ui, and category state
  transforms: [authTransform], // Apply transform to exclude loading states
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  turf: turfReducer,
  booking: bookingReducer,
  user: userReducer,
  admin: adminReducer,
  adminBooking: adminBookingReducer,
  category: categoryReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore Date objects in state since we now store them as ISO strings
        ignoredPaths: [
          "turf.turfs",
          "booking.bookings",
          "user.profile",
          "auth.user",
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = RootState;
