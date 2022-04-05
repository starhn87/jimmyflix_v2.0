import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { tab } from '../../reducers/DetailReducer'
import { useAppDispatch } from '../../store'
import { customMedia } from '../GlobalStyles'

const Tab = styled.div`
  margin-top: 20px;
  color: white;
  height: 50px;
  display: flex;
  align-items: center;
  vertical-align: center;
  padding: 0 10px;
  background-color: rgba(20, 20, 20, 0.8);
  z-index: 10;
  box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);

  ${customMedia.lessThan('mobile')`
        width: 95%;
        padding: 1%;
    `}
`

const List = styled.ul`
  display: contents;
  width: 100%;
`

const Li = styled.li`
  width: 100%;
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  &.active {
    border-bottom: 3px solid #b1ddf9;
    transition: border-bottom 0.1s;
  }
`

interface TabsProps {
  collections: boolean
  seasons: boolean
}

export default function Tabs({ collections, seasons }: TabsProps) {
  const dispatch = useAppDispatch()
  const [selected, setSelected] = useState('Trailer')
  const [menus, setMenu] = useState(['Trailer', 'Credits', 'Production'])

  useEffect(() => {
    const menu = [...menus]

    if (collections) {
      menu.push('Collection')
    }

    if (seasons) {
      menu.push('Season')
    }

    setMenu(menu)
  }, [])

  const onClick = (menu: string) => {
    dispatch(tab(menu))
    setSelected(menu)
  }

  return (
    <Tab>
      <List>
        {menus.map((menu) => (
          <Li
            className={`${selected === menu ? 'active' : ''}`}
            onClick={() => onClick(menu)}
          >
            {menu}
          </Li>
        ))}
      </List>
    </Tab>
  )
}
