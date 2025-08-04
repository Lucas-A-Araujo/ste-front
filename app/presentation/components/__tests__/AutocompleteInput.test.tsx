import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AutocompleteInput } from '../inputs/AutocompleteInput'

// Mock do useDebounce
vi.mock('../../controllers/hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value)
}))

describe('AutocompleteInput', () => {
  const defaultProps = {
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    value: '',
    onChange: vi.fn(),
    onSearch: vi.fn().mockResolvedValue(['suggestion1', 'suggestion2'])
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar label e input', () => {
    render(<AutocompleteInput {...defaultProps} />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('deve chamar onChange quando input muda', () => {
    const onChange = vi.fn()
    render(<AutocompleteInput {...defaultProps} onChange={onChange} />)
    
    const input = screen.getByPlaceholderText('Test Placeholder')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('deve mostrar sugestões quando digitado', async () => {
    render(<AutocompleteInput {...defaultProps} />)
    
    const input = screen.getByPlaceholderText('Test Placeholder')
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      expect(screen.getByText('suggestion1')).toBeInTheDocument()
      expect(screen.getByText('suggestion2')).toBeInTheDocument()
    })
  })

  it('deve chamar onChange quando sugestão é clicada', async () => {
    const onChange = vi.fn()
    render(<AutocompleteInput {...defaultProps} onChange={onChange} />)
    
    const input = screen.getByPlaceholderText('Test Placeholder')
    fireEvent.change(input, { target: { value: 'test' } })
    
    await waitFor(() => {
      const suggestion = screen.getByText('suggestion1')
      fireEvent.click(suggestion)
      
      expect(onChange).toHaveBeenCalledWith('suggestion1')
    })
  })

  it('deve mostrar erro quando fornecido', () => {
    render(<AutocompleteInput {...defaultProps} error="Test error" />)
    
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
}) 