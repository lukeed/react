import {useState, useEffect, useRef} from 'react'
import Box from '../Box'
import {DialogProps} from './Dialog'

const DialogActionSheet: React.FC<
  React.PropsWithChildren<{
    open: boolean
    onClose: (gesture: 'close-button' | 'escape' | 'drag' | 'overlay') => void
  }>
> = ({open, onClose, children}) => {
  // Refs
  let sheetContentRef = useRef()
  let dragIconRef = useRef()

  // Variables
  let startY = useRef(0)
  let startHeight = useRef(0)
  let isDragging = useRef(false)
  let sheetHeight = useRef(0)

  // Accessibility
  const isReduced =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true

  const showBottomSheet = () => {
    onClose(false)
    updateSheetHeight(50)
    document.body.style.overflowY = 'hidden'
  }
  const hideBottomSheet = (gesture: 'close-button' | 'escape' | 'overlay') => {
    onClose(gesture)
    document.body.style.overflowY = 'auto'
  }

  const updateSheetHeight = (height: number) => {
    sheetContentRef.current.style.height = `${height}vh` // updates the height of the sheet content
  }

  const dragStop = e => {
    isDragging.current = false
    const sheetHeight = parseInt(sheetContentRef.current?.style.height ?? 0)
    sheetContentRef.current.style.transition = isReduced ? 'none' : '0.3s ease'

    if (sheetHeight < 25) {
      return hideBottomSheet('drag')
    }

    if (sheetHeight > 75) {
      return updateSheetHeight(90)
    }

    updateSheetHeight(50)
  }
  const dragStart = e => {
    console.log('drag start')
    startY.current = e.pageY || e.touches?.[0].pageY
    startHeight.current = parseInt(sheetContentRef.current?.style.height ?? 0)
    isDragging.current = true
    sheetContentRef.current.style.transition = 'none'
  }

  const dragging = e => {
    if (!isDragging.current) return
    const delta = startY.current - (e.pageY || e.touches?.[0].pageY)
    const newHeight = startHeight.current + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  useEffect(() => {
    document.addEventListener('mouseup', dragStop)
    dragIconRef.current.addEventListener('mousedown', dragStart)
    document.addEventListener('mousemove', dragging)

    document.addEventListener('touchend', dragStop)
    dragIconRef.current.addEventListener('touchstart', dragStart)
    document.addEventListener('touchmove', dragging)

    return () => {
      document.removeEventListener('mouseup', dragStop)
      dragIconRef.current.removeEventListener('mousedown', dragStart)
      document.removeEventListener('mousemove', dragging)

      document.removeEventListener('touchend', dragStop)
      dragIconRef.current.removeEventListener('touchstart', dragStart)
      document.removeEventListener('touchmove', dragging)
    }
  }, [])

  const isFullScreen = sheetHeight?.current === 100

  return (
    <Box
      id="bottom-sheet"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        transition: isReduced ? 'none' : '0.1s linear',
      }}
    >
      <Box
        id="sheet-overlay"
        onClick={() => hideBottomSheet('overlay')}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
          bg: 'primer.canvas.backdrop',
        }}
      ></Box>
      <Box
        id="content"
        ref={sheetContentRef}
        sx={{
          bg: 'canvas.default',
          height: '50vh',
          maxHeight: '100vh',
          width: '100%',
          borderRadius: isFullScreen ? 0 : '10px 10px 0 0',
          overflowY: isFullScreen && 'hidden',
          position: 'relative',
          transform: open ? 'translateY(0%)' : 'translateY(100%)',
        }}
      >
        <Box
          id="header"
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            ref={dragIconRef}
            sx={{
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <Box
              as="span"
              sx={{
                height: 10,
                width: 100,
                display: 'block',
                bg: 'blue',
                borderRadius: 5,
              }}
            ></Box>
          </Box>
        </Box>

        <Box
          className="body"
          sx={{
            overflowY: 'auto',
            height: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default DialogActionSheet
