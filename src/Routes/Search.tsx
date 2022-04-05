import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import Loader from '../Components/Loader'
import Helmet from '../Components/Helmet'
import { useSearch } from '../hooks/useSearch'
import SearchResult from '../Components/SearchResult'
import { shallowEqual } from 'react-redux'
import { SearchState } from '../reducers/SearchReducer'
import { customMedia } from '../Components/GlobalStyles'
import { useAppSelector } from '../store'
import { MdOutlineMovie } from 'react-icons/md'

const Container = styled.div`
  padding: 0 20px;
`

const SearchBar = styled.input`
  position: absolute;
  display: block;
  width: 600px;
  height: 44px;
  top: 7px;
  padding: 0 25px;
  line-height: 44px;
  outline: 0;
  border: 0;
  font-size: 24px;
  font-weight: 400;
  color: #fff;
  background: transparent;
  animation: fadein 1s;

  &::placeholder {
    color: rgba(255, 250, 250, 0.6);
  }

  ${customMedia.lessThan('mobile')`
    font-size: 18px;
	`}
`

const Button = styled.button`
  position: absolute;
  width: 65px;
  height: 44px;
  top: 10px;
  right: 0;
  line-height: 44px;
  font-size: 24px;
  font-weight: 400;
  color: #fff;
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }
`

const SearchBox = styled.article`
  position: absolute;
  width: 500px;
  height: 67px;
  top: calc(100vh - 50%);
  left: 50%;
  padding: 5px;
  transform: translate(-50%, -50%);
  background: transparent;
  box-sizing: border-box;
  border-radius: 33.5px;
  border: 4px solid #fff;

  ${customMedia.greaterThan('desktop')`
    width: 670px;
    transition: 1s;
    animation: asc 1s;
	`}

  ${customMedia.between('mobile', 'desktop')`
    transition: 1s;
    animation: desc 1s;
	`}

  ${customMedia.lessThan('mobile')`
    width: 80%;
    font-size: 15px;
	`}
  
  @keyframes asc {
    from {
      width: 500px;
    }
    to {
      width: 670px;
    }
  }

  @keyframes desc {
    from {
      width: 670px;
    }
    to {
      width: 500px;
    }
  }
`

export interface SearchProps {
  search: SearchState
}

function Search() {
  const loading = useAppSelector(
    (state: SearchProps) => state.search.loading,
    shallowEqual,
  )
  const [value, setValue] = useState('')
  const { handleSubmit } = useSearch()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(value)
  }

  useEffect(() => {
    setValue('')
  }, [loading])

  return (
    <Container>
      <Helmet content="Search | Jimmyflix" />
      {loading !== null ? (
        loading ? (
          <Loader />
        ) : (
          <SearchResult />
        )
      ) : (
        <SearchBox>
          <form onSubmit={onSubmit}>
            <SearchBar
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.value)
              }
              placeholder="영화 / TV쇼 검색"
            />
            <Button type="submit">
              <MdOutlineMovie />
            </Button>
          </form>
        </SearchBox>
      )}
    </Container>
  )
}

export default Search
