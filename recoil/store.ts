import { atom } from 'recoil'
import { TimeType } from '../interface'

export const isSearchedState = atom({
  key: 'isSearched',
  default: false,
})

export const searchValueState = atom({
  key: 'searchValue',
  default: '',
})

export const timeTypeState = atom<TimeType>({
  key: 'timeType',
  default: 'Day',
})
