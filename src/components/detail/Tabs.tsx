import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TabType } from '../../interface'
import { customMedia } from '../../GlobalStyles'
interface TabsProps {
  selected: string
  collections: boolean
  seasons: boolean
  onClick: Dispatch<SetStateAction<TabType>>
}

export default function Tabs({
  selected,
  collections,
  seasons,
  onClick,
}: TabsProps) {
  const [menus, setMenu] = useState<TabType[]>([
    'Trailer',
    'Credits',
    'Production',
  ])

  useEffect(() => {
    const newMenus = [...menus]

    if (collections) {
      newMenus.push('Collection')
    }

    if (seasons) {
      newMenus.push('Season')
    }

    setMenu(newMenus)
  }, [])

  return (
    <Tab>
      <List>
        {menus.map((menu: TabType) => (
          <Li
            key={menu}
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

const Tab = styled.div`
  margin-top: 20px;
  color: white;
  height: 48px;
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
