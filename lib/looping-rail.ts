type Direction = -1 | 1

const modulo = (value: number, length: number) => ((value % length) + length) % length

/** Recycle the original cards offscreen; never reset an in-flight native scroll. */
export function createLoopingRail(rail: HTMLElement, onLoopChange: (enabled: boolean) => void) {
  const cards = Array.from(rail.children) as HTMLElement[]
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let enabled = false
  let stride = 0
  let cycle = 0
  let padding = 0
  let cardWidth = 0
  let position = 0
  let target = 0
  let velocity = 0
  let frame = 0
  let previousTime = 0
  let wheelTimer = 0
  let suppressClickUntil = 0
  let pointer: {
    id: number; startX: number; startY: number; x: number; time: number; dragging: boolean
  } | null = null

  const render = () => {
    // Each card moves to the other end only after it is entirely outside the viewport.
    const buffer = cardWidth + padding
    cards.forEach((card, index) => {
      const base = index * stride
      const x = modulo(base - position + buffer, cycle) - buffer
      card.style.transform = `translate3d(${x - base}px, 0, 0)`
    })
  }

  const stop = () => {
    window.cancelAnimationFrame(frame)
    frame = 0
    previousTime = 0
  }

  const settle = () => {
    stop()
    position = target = modulo(target, cycle)
    velocity = 0
    render()
  }

  const tick = (time: number) => {
    const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16
    previousTime = time
    // A critically damped spring keeps velocity continuous when buttons are pressed again.
    const frequency = 0.018
    const distance = position - target
    const spring = velocity + frequency * distance
    const decay = Math.exp(-frequency * elapsed)
    position = target + (distance + spring * elapsed) * decay
    velocity = (velocity - frequency * spring * elapsed) * decay
    render()
    if (Math.abs(position - target) < 0.05 && Math.abs(velocity) < 0.01) settle()
    else frame = window.requestAnimationFrame(tick)
  }

  const animate = () => {
    if (reducedMotion.matches) settle()
    else if (!frame) frame = window.requestAnimationFrame(tick)
  }

  const snap = () => {
    target = Math.round(position / stride) * stride
    animate()
  }

  const releasePointer = () => {
    if (pointer && rail.hasPointerCapture(pointer.id)) rail.releasePointerCapture(pointer.id)
    pointer = null
    rail.style.removeProperty('user-select')
  }

  const scroll = (direction: Direction) => {
    if (!enabled) return
    window.clearTimeout(wheelTimer)
    releasePointer()
    const visibleCards = Math.max(1, Math.floor((rail.clientWidth - padding * 2) / stride))
    target = Math.round(target / stride) * stride + direction * visibleCards * stride
    animate()
  }

  const pointerDown = (event: PointerEvent) => {
    if (!enabled || !event.isPrimary || event.button !== 0) return
    stop()
    window.clearTimeout(wheelTimer)
    target = position
    velocity = 0
    suppressClickUntil = 0
    pointer = {
      id: event.pointerId, startX: event.clientX, startY: event.clientY,
      x: event.clientX, time: event.timeStamp, dragging: false,
    }
  }

  const pointerMove = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return
    if (!pointer.dragging) {
      const horizontal = Math.abs(event.clientX - pointer.startX)
      const vertical = Math.abs(event.clientY - pointer.startY)
      if (Math.max(horizontal, vertical) < 6) return
      if (vertical > horizontal) {
        releasePointer()
        snap()
        return
      }
      pointer.dragging = true
      rail.setPointerCapture(event.pointerId)
      rail.style.userSelect = 'none'
    }
    const delta = pointer.x - event.clientX
    const elapsed = Math.max(1, event.timeStamp - pointer.time)
    velocity = velocity * 0.3 + (delta / elapsed) * 0.7
    pointer.x = event.clientX
    pointer.time = event.timeStamp
    position += delta
    target = position
    render()
  }

  const pointerEnd = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return
    // Touch starts with implicit capture on the image. Its bubbling loss of capture
    // when we take over is not the end of the drag on the rail.
    if (event.type === 'lostpointercapture' && event.target !== rail) return
    const dragged = pointer.dragging
    if (event.type === 'pointercancel' || event.timeStamp - pointer.time > 100) velocity = 0
    releasePointer()
    if (dragged) {
      suppressClickUntil = performance.now() + 400
      const momentum = Math.max(-3.5, Math.min(velocity, 3.5)) * 180
      target = Math.round((position + momentum) / stride) * stride
      animate()
    } else snap()
  }

  const click = (event: MouseEvent) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const dragStart = (event: DragEvent) => { if (enabled) event.preventDefault() }

  const wheel = (event: WheelEvent) => {
    if (!enabled || event.ctrlKey) return
    const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX
    if (!delta || (!event.shiftKey && Math.abs(event.deltaY) >= Math.abs(delta))) return
    event.preventDefault()
    stop()
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1
    position += delta * unit
    target = position
    velocity = 0
    render()
    window.clearTimeout(wheelTimer)
    wheelTimer = window.setTimeout(snap, 100)
  }

  const reveal = (element: EventTarget | null) => {
    if (!enabled || !(element instanceof HTMLElement) || pointer) return
    const card = element.closest<HTMLElement>('[data-loop-origin]')
    if (!card) return
    const buffer = cardWidth + padding
    const left = modulo(cards.indexOf(card) * stride - position + buffer, cycle) - buffer + padding
    const right = left + cardWidth
    const visibleRight = rail.clientWidth - padding
    if (left >= padding - 1 && right <= visibleRight + 1) return
    stop()
    position += left < padding ? left - padding : right - visibleRight
    target = position
    velocity = 0
    render()
  }

  const focus = (event: FocusEvent) => reveal(event.target)

  const keyDown = (event: KeyboardEvent) => {
    if (!enabled || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    scroll(event.key === 'ArrowLeft' ? -1 : 1)
  }

  const restore = () => {
    delete rail.dataset.looping
    for (const property of ['overflow-x', 'overflow-y', 'scroll-snap-type', 'touch-action', 'overflow-anchor', 'user-select', 'transition-property']) {
      rail.style.removeProperty(property)
    }
    cards.forEach((card) => {
      card.style.removeProperty('transform')
      card.style.removeProperty('transition-property')
    })
  }

  const measure = () => {
    if (!cards.length) return
    const style = window.getComputedStyle(rail)
    const width = cards[0].getBoundingClientRect().width
    const nextStride = width + (Number.parseFloat(style.columnGap) || 0)
    if (nextStride <= 0) return
    const nextCycle = nextStride * cards.length
    // A complete offscreen card is needed to recycle without exposing either edge.
    const nextEnabled = nextCycle >= rail.clientWidth + nextStride
    stop()
    releasePointer()
    window.clearTimeout(wheelTimer)
    position = enabled && stride ? position / stride * nextStride : rail.scrollLeft
    target = position
    velocity = 0
    stride = nextStride
    cycle = nextCycle
    cardWidth = width
    padding = Number.parseFloat(style.paddingLeft) || 0
    if (nextEnabled) {
      // Global reduced-motion rules must not interpolate the offscreen recycling step.
      rail.style.transitionProperty = 'none'
      cards.forEach((card) => { card.style.transitionProperty = 'none' })
      // Unlike hidden, clip cannot trigger a second native scroll on focus or resize.
      rail.style.overflowX = 'clip'
      rail.style.overflowY = 'clip'
      rail.style.scrollSnapType = 'none'
      rail.style.touchAction = 'pan-y pinch-zoom'
      rail.style.overflowAnchor = 'none'
      rail.scrollLeft = 0
      rail.dataset.looping = 'true'
      render()
    } else if (enabled) {
      restore()
      rail.scrollLeft = position
    }
    if (nextEnabled !== enabled) {
      enabled = nextEnabled
      onLoopChange(enabled)
    }
    if (rail.contains(document.activeElement)) reveal(document.activeElement)
  }

  rail.addEventListener('pointerdown', pointerDown)
  rail.addEventListener('pointermove', pointerMove)
  rail.addEventListener('pointerup', pointerEnd)
  rail.addEventListener('pointercancel', pointerEnd)
  rail.addEventListener('lostpointercapture', pointerEnd)
  rail.addEventListener('click', click, true)
  rail.addEventListener('dragstart', dragStart)
  rail.addEventListener('wheel', wheel, { passive: false })
  rail.addEventListener('focusin', focus)
  rail.addEventListener('keydown', keyDown)

  const resizeObserver = new ResizeObserver(measure)
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      resizeObserver.observe(rail)
      if (cards[0]) resizeObserver.observe(cards[0])
    } else {
      resizeObserver.disconnect()
      if (enabled && frame) settle()
    }
  }, { rootMargin: '400px 0px' })
  visibilityObserver.observe(rail.closest('section') || rail)

  return {
    scroll,
    destroy() {
      stop()
      window.clearTimeout(wheelTimer)
      releasePointer()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      rail.removeEventListener('pointerdown', pointerDown)
      rail.removeEventListener('pointermove', pointerMove)
      rail.removeEventListener('pointerup', pointerEnd)
      rail.removeEventListener('pointercancel', pointerEnd)
      rail.removeEventListener('lostpointercapture', pointerEnd)
      rail.removeEventListener('click', click, true)
      rail.removeEventListener('dragstart', dragStart)
      rail.removeEventListener('wheel', wheel)
      rail.removeEventListener('focusin', focus)
      rail.removeEventListener('keydown', keyDown)
      restore()
    },
  }
}
