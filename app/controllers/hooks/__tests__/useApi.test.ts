import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useApi } from '../useApi'

describe('useApi', () => {
  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useApi<string>())
    
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve executar API com sucesso', async () => {
    const { result } = renderHook(() => useApi<string>())
    const mockApiCall = vi.fn().mockResolvedValue('success')
    
    await act(async () => {
      await result.current.execute(mockApiCall)
    })
    
    expect(result.current.data).toBe('success')
    expect(result.current.loading).toBe(false)
  })
}) 