import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deve retornar valor inicial', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('deve salvar valor no localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test')).toBe('"new-value"')
  })
}) 