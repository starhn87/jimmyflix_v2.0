import { applyMiddleware, configureStore, createStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import DetailReducer from "./reducers/DetailReducer";
import HomeReducer from "./reducers/HomeReducer";
import SearchReducer from "./reducers/SearchReducer";
import TVReducer from "./reducers/TVReducer";
import logger from "redux-logger";

export const store = configureStore({
    reducer: {
        home: HomeReducer,
        tv: TVReducer,
        detail: DetailReducer,
        search: SearchReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});

