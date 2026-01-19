import { useState, useRef, useEffect, useCallback } from 'react'

export function useDraggable(initialPosition = { x: 16, y: 16 }) {
  // Responsive initial positioning
  const getResponsivePosition = useCallback(() => {
    const isMobile = window.innerWidth < 768
    const padding = isMobile ? 8 : 16
    
    let x = initialPosition.x
    let y = initialPosition.y
    
    // Handle negative positions (right/bottom edge positioning)
    if (x < 0) {
      x = Math.max(padding, window.innerWidth + x - 80) // Adjust for element width
    }
    if (y < 0) {
      y = Math.max(padding, window.innerHeight + y - 80) // Adjust for element height
    }
    
    // Ensure within bounds
    return {
      x: Math.max(padding, Math.min(x, window.innerWidth - 100)),
      y: Math.max(padding, Math.min(y, window.innerHeight - 100))
    }
  }, [initialPosition])

  const [position, setPosition] = useState(() => {
    // Safe initial position that works during SSR
    return { x: 16, y: 16 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const elementRef = useRef(null)
  const dragHandleRef = useRef(null)

  // Update position once window is available
  useEffect(() => {
    setPosition(getResponsivePosition())
  }, [getResponsivePosition])

  const handleMouseDown = useCallback((e) => {
    // Check if the target is within the drag handle
    const dragHandle = dragHandleRef.current
    if (!dragHandle) return
    
    // Allow dragging if clicking directly on the drag handle or its children
    const isOnDragHandle = dragHandle === e.target || dragHandle.contains(e.target)
    if (!isOnDragHandle) return
    
    // Prevent dragging if clicking on interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    e.preventDefault()
    e.stopPropagation()
  }, [position])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // Get element dimensions
    const element = elementRef.current
    const elementWidth = element?.offsetWidth || 200
    const elementHeight = element?.offsetHeight || 100

    // Responsive padding
    const isMobile = window.innerWidth < 768
    const padding = isMobile ? 8 : 16
    const maxX = window.innerWidth - elementWidth - padding
    const maxY = window.innerHeight - elementHeight - padding

    setPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY))
    })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e) => {
    const dragHandle = dragHandleRef.current
    if (!dragHandle) return
    
    const isOnDragHandle = dragHandle === e.target || dragHandle.contains(e.target)
    if (!isOnDragHandle) return
    
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
    
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    })
    e.preventDefault()
  }, [position])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y

    const element = elementRef.current
    const elementWidth = element?.offsetWidth || 200
    const elementHeight = element?.offsetHeight || 100

    const isMobile = window.innerWidth < 768
    const padding = isMobile ? 8 : 16
    const maxX = window.innerWidth - elementWidth - padding
    const maxY = window.innerHeight - elementHeight - padding

    setPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY))
    })
    e.preventDefault()
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])

  // Handle window resize with responsive repositioning
  useEffect(() => {
    const handleResize = () => {
      const element = elementRef.current
      const elementWidth = element?.offsetWidth || 200
      const elementHeight = element?.offsetHeight || 100

      const isMobile = window.innerWidth < 768
      const padding = isMobile ? 8 : 16
      const maxX = window.innerWidth - elementWidth - padding
      const maxY = window.innerHeight - elementHeight - padding

      setPosition(prev => ({
        x: Math.max(padding, Math.min(prev.x, maxX)),
        y: Math.max(padding, Math.min(prev.y, maxY))
      }))
    }

    window.addEventListener('resize', handleResize)
    // Initial resize check
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    position,
    isDragging,
    elementRef,
    dragHandleRef,
    dragHandleProps: {
      ref: dragHandleRef,
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      className: `cursor-grab active:cursor-grabbing select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`,
      style: { 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }
    }
  }
}