import { configureStore } from "@reduxjs/toolkit";
import DetailReducer from "./reducers/DetailReducer";
import HomeReducer from "./reducers/HomeReducer";
import SearchReducer from "./reducers/SearchReducer";
import TVReducer from "./reducers/TVReducer";

export const store = configureStore({
    reducer: {
        home: HomeReducer,
        tv: TVReducer,
        detail: DetailReducer
    }
})

