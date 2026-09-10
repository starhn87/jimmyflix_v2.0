import { atom } from 'recoil'
import { TimeType } from '../interface'

export const timeTypeState = atom<TimeType>({
  key: 'timeType',
  default: 'day',
})
