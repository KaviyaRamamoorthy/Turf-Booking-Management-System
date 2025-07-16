import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { RootState } from '../types';

// Import slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import turfReducer from './slices/turfSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import adminBookingReducer from './slices/adminBookingSlice';
import categoryReducer from './slices/categorySlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui', 'category'], // Persist auth, ui, and category state
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
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore Date objects in state since we now store them as ISO strings
        ignoredPaths: ['turf.turfs', 'booking.bookings', 'user.profile', 'auth.user'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type AppState = RootState; 