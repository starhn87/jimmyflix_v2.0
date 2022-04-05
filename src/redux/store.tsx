import { configureStore } from '@reduxjs/toolkit'
import DetailReducer from './DetailReducer'
import HomeReducer from './HomeReducer'
import SearchReducer from './SearchReducer'
import TVReducer from './TVReducer'
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
