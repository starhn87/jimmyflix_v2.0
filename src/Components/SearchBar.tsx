import React, { FormEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { MdSearch } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { moviesApi, tvApi } from '../api'
import { useAppDispatch } from '../redux/store'
import { fail, success } from '../redux/SearchReducer'

export default function SearchBar() {
  const [editingValue, setEditingValue] = useState('')
  const [focused, setFocused] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const navigator = useNavigate()
  const dispatch = useAppDispatch()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchRef.current?.blur()
    navigator('/search')
    handleSubmit(editingValue)
    setEditingValue('')
  }

  const handleSubmit = (value: string) => {
    if (value.trim() !== '') {
      searchByTerm(value)
    } else {
      alert('Input what you wannt to know!')
    }
  }

  const searchByTerm = async (value: string) => {
    try {
      const {
        data: { results: movieResults },
      } = await moviesApi.search(value)
      const {
        data: { results: tvResults },
      } = await tvApi.search(value)
      dispatch(success({ movieResults, tvResults }))
    } catch {
      dispatch(fail())
    }
  }

  return (
    <SearchBarWrapper className={focused ? 'active' : ''}>
      <Form onSubmit={onSubmit}>
        <Search
          ref={searchRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          type="text"
          placeholder="영화 / TV쇼 검색"
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
