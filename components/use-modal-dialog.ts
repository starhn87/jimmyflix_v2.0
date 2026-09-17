'use client'

import { useEffect, useRef, type KeyboardEvent, type RefObject, type SyntheticEvent } from 'react'

let scrollLocks = 0
let previousOverflow = ''
let previousGutter = ''

function lockScroll() {
  const root = document.documentElement
  if (scrollLocks++ === 0) {
    previousOverflow = root.style.overflow
    previousGutter = root.style.scrollbarGutter
    root.style.scrollbarGutter = 'stable'
    root.style.overflow = 'hidden'
  }
  return () => {
    if (--scrollLocks === 0) {
      root.style.overflow = previousOverflow
      root.style.scrollbarGutter = previousGutter
    }
  }
}

export function useModalDialog(returnFocus: RefObject<HTMLButtonElement | null>, onClose: () => void) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const trigger = returnFocus.current
    const unlock = lockScroll()
    element.showModal()
    closeButton.current?.focus({ preventScroll: true })
    return () => {
      element.close()
      unlock()
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [returnFocus])

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      dialog.current?.close()
      return
    }
    if (event.key !== 'Tab') return
    const elements = [...event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]',
    )].filter((element) => element.getClientRects().length > 0)
    const first = elements[0]
    const last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus()
    }
  }
  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    // Strict Mode reopens the dialog before the cleanup's queued close event fires.
    if (!event.currentTarget.open) onClose()
  }
  return { dialog, closeButton, trapFocus, handleClose, close: () => dialog.current?.close() }
}
