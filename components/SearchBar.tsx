import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import { MdOutlineMovie } from 'react-icons/md'

interface SearchBarProps {
  initialValue?: string
  compact?: boolean
  onSubmit: (editingValue: string) => void
}

export default function SearchBar({
  initialValue = '',
  compact = false,
  onSubmit,
}: SearchBarProps) {
  const [editingValue, setEditingValue] = useState(initialValue)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setEditingValue(initialValue)
    setError('')
  }, [initialValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingValue(event.target.value)

    if (error) {
      setError('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = editingValue.trim()

    if (!query) {
      setError('Enter a movie or TV show title.')
      inputRef.current?.focus()
      return
    }

    setError('')
    onSubmit(query)
  }

  return (
    <SearchBox compact={compact} aria-label="Search movies and TV shows">
      <Form onSubmit={handleSubmit} noValidate>
        <Label htmlFor="main-search-query">Movie or TV show title</Label>
        <SearchInput
          ref={inputRef}
          id="main-search-query"
          value={editingValue}
          onChange={handleChange}
          placeholder="Search movies and TV shows"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'main-search-error' : undefined}
          spellCheck={false}
        />
        <Button type="submit" aria-label="Search movies and TV shows">
          <MdOutlineMovie aria-hidden="true" />
        </Button>
      </Form>
      {error && (
        <ErrorMessage id="main-search-error" role="alert">
          {error}
        </ErrorMessage>
      )}
    </SearchBox>
  )
}

const SearchBox = styled.section<{ compact: boolean }>`
  width: min(100%, 670px);
  margin: ${(props) =>
    props.compact
      ? 'clamp(52px, 8vw, 84px) auto 36px'
      : 'clamp(140px, 34vh, 320px) auto 0'};

  @media (max-width: 768px) {
    margin-top: ${(props) => (props.compact ? '48px' : '28vh')};
  }
`

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 56px;
  min-height: 58px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.85);
  border-radius: 30px;
  background: rgba(20, 20, 20, 0.72);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: #4d96fb;
    box-shadow: 0 0 0 3px rgba(77, 150, 251, 0.3);
  }
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

const SearchInput = styled.input`
  min-width: 0;
  width: 100%;
  padding: 0 8px 0 24px;
  outline: 0;
  border: 0;
  font-size: clamp(17px, 2.5vw, 22px);
  color: #fff;
  background: transparent;

  &::placeholder {
    color: rgba(255, 255, 255, 0.62);
  }
`

const Button = styled.button`
  display: grid;
  place-items: center;
  min-width: 48px;
  border: 0;
  font-size: 25px;
  color: #fff;
  background-color: transparent;

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -5px;
    border-radius: 999px;
  }
`

const ErrorMessage = styled.p`
  margin: 10px 20px 0;
  color: #ff9c91;
  font-size: 14px;
`
