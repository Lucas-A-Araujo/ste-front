import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('deve retornar valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('deve debounce mudanças de valor', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )
    
    act(() => {
      rerender({ value: 'changed' })
    })
    
    expect(result.current).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('changed')
  })

  it('deve cancelar timeout anterior', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )
    
    act(() => {
      rerender({ value: 'changed1' })
      rerender({ value: 'changed2' })
    })
    
    expect(result.current).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('changed2')
  })
}) 