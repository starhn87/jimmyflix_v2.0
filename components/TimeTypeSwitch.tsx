import React from 'react'
import styled from '@emotion/styled'
import { TimeType } from '../interface'
import { useRecoilState } from 'recoil'
import { timeTypeState } from '../recoil/store'

const TIME_TYPES: { id: number; label: string; value: TimeType }[] = [
  {
    id: 1,
    label: 'Day',
    value: 'day',
  },
  {
    id: 2,
    label: 'Week',
    value: 'week',
  },
]

export default function TimeTypeSwitch() {
  const [timeType, setTimeType] = useRecoilState(timeTypeState)

  const onClick = (type: TimeType) => {
    setTimeType(type)
  }

  return (
    <Wrapper>
      <MatchTypeBox>
        {TIME_TYPES.map((time) => (
          <MatchType
            key={time.id}
            type="button"
            aria-pressed={timeType === time.value}
            className={`${timeType === time.value ? 'active' : ''}`}
            onClick={() => onClick(time.value)}
          >
            <ContentBox>{time.label}</ContentBox>
          </MatchType>
        ))}
      </MatchTypeBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const MatchTypeBox = styled.div`
  display: inline-block;
  overflow: hidden;
  min-width: 204px;
  margin: 40px 20px 20px;
  padding: 0;
  border-radius: 5px;
  border: 2px solid #4d96fb;

  @media (max-width: 350px) {
    margin: 30px 20px 20px;
  }
`

const MatchType = styled.button`
  display: inline-block;
  width: 120px;
  height: 35px;
  margin: 0;
  padding: 0;
  font-size: 15px;
  font-weight: 400;
  vertical-align: middle;
  text-align: center;
  background-color: transparent;
  color: #4d96fb;
  border: none;

  &.active {
    background-color: #4d96fb;
    color: white;
  }

  @media (max-width: 350px) {
    width: 100px;
    height: 30px;
    font-size: 12px;
  }
`

const ContentBox = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1px;
`
