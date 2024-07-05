import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
let rootReducer = combineReducers({user: userReducer})
let persistConfig = {
    key: 'root',
    storage,
    version: 1
}
let persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: false,
    })
})

export let persistor = persistStore(store)