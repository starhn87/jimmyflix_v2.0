import React, { FormEvent, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { MdSearch } from 'react-icons/md'
import { useRouter } from 'next/router'

export default function SearchBar() {
  const [editingValue, setEditingValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = editingValue.trim()

    if (!query) {
      setError('Enter a title to search.')
      searchRef.current?.focus()
      return
    }

    setError('')
    searchRef.current?.blur()
    setEditingValue('')
    void router.push({
      pathname: '/search',
      query: { q: query },
    })
  }

  return (
    <SearchBarWrapper
      className={focused ? 'active' : ''}
      invalid={Boolean(error)}
    >
      <Form onSubmit={onSubmit} noValidate>
        <Label htmlFor="header-search-query">Search movies and TV shows</Label>
        <Search
          ref={searchRef}
          id="header-search-query"
          value={editingValue}
          onChange={(event) => {
            setEditingValue(event.target.value)
            setError('')
          }}
          type="search"
          placeholder="Search titles"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'header-search-error' : undefined}
          spellCheck={false}
        />
        <Button type="submit" aria-label="Search movies and TV shows">
          <MdSearch size={18} aria-hidden="true" />
        </Button>
      </Form>
      {error && (
        <ErrorMessage id="header-search-error" role="alert">
          {error}
        </ErrorMessage>
      )}
    </SearchBarWrapper>
  )
}

const SearchBarWrapper = styled.div<{ invalid: boolean }>`
  position: relative;
  width: 195px;
  background: transparent;
  border: none;
  border-bottom: 1px solid
    ${(props) => (props.invalid ? '#ff9c91' : '#fff')};
  opacity: ${(props) => (props.invalid ? 1 : 0.65)};
  transition: opacity 0.2s ease, border-color 0.2s ease;

  &:hover,
  &.active {
    opacity: 1;
  }
`

const Form = styled.form`
  display: grid;
  height: 100%;
  padding: 5px 0;
  grid-template-columns: minmax(0, 1fr) 34px;
  align-items: center;
`

const Label = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Search = styled.input`
  min-width: 0;
  width: 100%;
  height: 100%;
  padding: 0 0 0 10px;
  background-color: transparent;
  border: none;
  font-size: 12px;
  color: white;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
`

const Button = styled.button`
  display: grid;
  place-items: center;
  min-width: 34px;
  min-height: 34px;
  color: white;
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid #4d96fb;
    outline-offset: 1px;
    border-radius: 50%;
  }
`

const ErrorMessage = styled.p`
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  width: max-content;
  max-width: 220px;
  padding: 7px 9px;
  border-radius: 4px;
  color: #fff;
  background: #9f3128;
  font-size: 12px;
`
