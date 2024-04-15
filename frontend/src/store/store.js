import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';

const persistConfig = {
    key: 'root',
    storage, // by default value brower local storage
};


const persistedReducer = persistReducer(persistConfig, combineReducers({
    auth:authSlice 
}));


const store = configureStore({
    reducer: persistedReducer,
});

const persistor = persistStore(store);
export { store, persistor };
