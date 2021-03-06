import React, { FormEvent, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { MdSearch } from 'react-icons/md'
import { useSetRecoilState } from 'recoil'
import { isSearchedState, searchValueState } from '../recoil/store'
import { useRouter } from 'next/router'

export default function SearchBar() {
  const [editingValue, setEditingValue] = useState('')
  const [focused, setFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const setSearchValue = useSetRecoilState(searchValueState)
  const setIsSearched = useSetRecoilState(isSearchedState)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditingValue('')

    if (editingValue.trim() === '') {
      alert('Input what you want to search!')
      return
    }

    searchRef.current?.blur()
    router.push('/search')
    setSearchValue(editingValue)
    setIsSearched(true)
  }

  return (
    <SearchBarWrapper className={focused ? 'active' : ''}>
      <Form onSubmit={onSubmit}>
        <Search
          ref={searchRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          type="text"
          placeholder="Movie / TV Show Search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
        />
        <Button type="submit">
          <MdSearch size={18} />
        </Button>
      </Form>
    </SearchBarWrapper>
  )
}

const SearchBarWrapper = styled.article`
  width: 195px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  opacity: 0.5;
  transition: 0.3s ease;

  &:hover,
  &.active {
    opacity: 1;
  }
`

const Form = styled.form`
  display: grid;
  height: 100%;
  padding: 5px 0;
  grid-template-columns: 85% 15%;
  align-items: center;
`

const Search = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 0 0 10px;
  background-color: transparent;
  border: none;
  font-size: 12px;
  color: white;
  outline: none;

  &::placeholder {
    color: white;
  }

  &:focus {
  }
`

const Button = styled.button`
  position: relative;
  top: 4px;
  font-size: 14px;
  color: white;
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }
`
