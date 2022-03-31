import { configureStore } from '@reduxjs/toolkit'
import DetailReducer from './reducers/DetailReducer'
import HomeReducer from './reducers/HomeReducer'
import SearchReducer from './reducers/SearchReducer'
import TVReducer from './reducers/TVReducer'
import { createLogger } from 'redux-logger'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const logMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV !== 'production',
})

const store = configureStore({
  reducer: {
    home: HomeReducer,
    tv: TVReducer,
    detail: DetailReducer,
    search: SearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logMiddleware),
})

export type AppState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
