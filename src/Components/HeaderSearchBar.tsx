import React, { FormEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { MdSearch } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../redux/store'
import { searched } from '../redux/searchReducer'

export default function SearchBar() {
  const [editingValue, setEditingValue] = useState('')
  const [focused, setFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const navigator = useNavigate()
  const dispatch = useAppDispatch()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditingValue('')

    if (editingValue.trim() === '') {
      alert('Input what you want to search!')
      return
    }

    searchRef.current?.blur()
    navigator('/search')
    dispatch(searched(editingValue))
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
