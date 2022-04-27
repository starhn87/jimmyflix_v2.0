import React from 'react'
import styled from 'styled-components'
import { TimeType } from '../interface'
import { useRecoilState } from 'recoil'
import { timeTypeState } from '../recoil/store'

const TIME_TYPE = [
  {
    id: 1,
    name: 'Day',
  },
  {
    id: 2,
    name: 'Week',
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
        {TIME_TYPE.map((time) => (
          <MatchType
            key={time.id}
            className={`${timeType === time.name ? 'active' : ''}`}
            onClick={() => onClick(time.name as TimeType)}
          >
            <ContentBox>{time.name}</ContentBox>
          </MatchType>
        ))}
      </MatchTypeBox>
    </Wrapper>
  )
}

const Wrapper = styled.article`
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

const ContentBox = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1px;
`

const Icon = styled.div`
  margin-right: 5px;
  font-size: 18px;
`
