import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStorage } from '../useSessionStorage'

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('deve retornar valor inicial', () => {
    const { result } = renderHook(() => useSessionStorage('test', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('deve retornar valor do sessionStorage quando existe', () => {
    sessionStorage.setItem('test', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useSessionStorage('test', 'initial'))
    expect(result.current[0]).toBe('stored-value')
  })

  it('deve salvar valor no sessionStorage', () => {
    const { result } = renderHook(() => useSessionStorage('test', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(sessionStorage.getItem('test')).toBe('"new-value"')
  })

  it('deve remover valor do sessionStorage', () => {
    sessionStorage.setItem('test', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useSessionStorage('test', 'initial'))
    
    act(() => {
      result.current[2]()
    })
    
    expect(result.current[0]).toBe('initial')
    expect(sessionStorage.getItem('test')).toBeNull()
  })
}) 