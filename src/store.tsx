import { configureStore } from '@reduxjs/toolkit'
import DetailReducer from './reducers/DetailReducer'
import HomeReducer from './reducers/HomeReducer'
import SearchReducer from './reducers/SearchReducer'
import TVReducer from './reducers/TVReducer'
import { createLogger } from 'redux-logger'

const logMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV !== 'production',
})

export const store = configureStore({
  reducer: {
    home: HomeReducer,
    tv: TVReducer,
    detail: DetailReducer,
    search: SearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logMiddleware),
})
