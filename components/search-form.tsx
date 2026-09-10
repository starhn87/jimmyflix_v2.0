'use client'

import Form from 'next/form'
import { type FormEvent, type RefObject, useState } from 'react'
import { SearchIcon } from '@/components/icons'
import { getLocalePath, type HeaderMessages, type Locale } from '@/lib/i18n'

interface SearchFormProps {
  locale: Locale
  messages: HeaderMessages
  initialQuery?: string
  inputRef: RefObject<HTMLInputElement | null>
}

export function SearchForm({ locale, messages, initialQuery = '', inputRef }: SearchFormProps) {
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const input = inputRef.current
    const query = input?.value.trim() || ''

    if (!query) {
      event.preventDefault()
      setError(messages.searchEmptyError)
      input?.focus()
      return
    }

    if (input) input.value = query
    setError('')
  }

  return (
    <Form action={getLocalePath(locale, '/search')} prefetch={false} onSubmit={handleSubmit} role="search">
      <label htmlFor="catalog-search" className="sr-only">
        {messages.searchLabel}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="catalog-search"
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder={messages.searchPlaceholder}
          maxLength={200}
          onChange={() => { if (error) setError('') }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'catalog-search-error' : undefined}
          spellCheck={false}
          className="h-11 w-full min-w-0 rounded-full border border-tone/12 bg-tone/6 py-2 pr-12 pl-4 text-base text-ink outline-none transition placeholder:text-faint hover:border-tone/25 focus:border-accent/70 focus:bg-tone/9 focus:ring-3 focus:ring-accent/10 lg:text-sm"
        />
        <button
          type="submit"
          aria-label={messages.searchButton}
          className="absolute top-0 right-0 grid size-11 place-items-center rounded-full text-subtle outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
      {error ? (
        <p id="catalog-search-error" role="alert" className="mt-2 px-3 text-xs text-danger lg:absolute lg:top-full lg:right-0 lg:mt-2 lg:rounded-lg lg:border lg:border-tone/12 lg:bg-canvas lg:py-3 lg:shadow-panel">
          {error}
        </p>
      ) : null}
    </Form>
  )
}
