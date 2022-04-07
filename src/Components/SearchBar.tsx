import React, { ChangeEvent, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { customMedia } from '../GlobalStyles'
import { MdOutlineMovie } from 'react-icons/md'

interface SearchBarProps {
  onSubmit: (editingValue: string) => void
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [editingValue, setEditingValue] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditingValue('')

    if (editingValue.trim() === '') {
      alert('Input what you want to search!')
      return
    }

    onSubmit(editingValue)
  }

  return (
    <SearchBox>
      <form onSubmit={handleSubmit}>
        <SearchInput
          value={editingValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEditingValue(e.target.value)
          }
          placeholder="Movie / TV Show Search"
        />
        <Button type="submit">
          <MdOutlineMovie />
        </Button>
      </form>
    </SearchBox>
  )
}

const SearchInput = styled.input`
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
    color: rgba(255, 255, 255, 0.6);
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
