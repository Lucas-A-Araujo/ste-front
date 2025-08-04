import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseInput } from '../inputs/BaseInput'

describe('BaseInput', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderização básica', () => {
    it('deve renderizar label quando fornecido', () => {
      render(<BaseInput {...defaultProps} />)
      
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('deve renderizar input com id e name corretos', () => {
      render(<BaseInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'test-input')
      expect(input).toHaveAttribute('name', 'test')
    })

    it('deve renderizar placeholder quando fornecido', () => {
      render(<BaseInput {...defaultProps} placeholder="Test placeholder" />)
      
      expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
    })

    it('deve renderizar sem label quando não fornecido', () => {
      const { label, ...propsWithoutLabel } = defaultProps
      render(<BaseInput {...propsWithoutLabel} />)
      
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
    })
  })

  describe('Tipos de input', () => {
    it('deve renderizar input de texto por padrão', () => {
      render(<BaseInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('deve renderizar input de email corretamente', () => {
      render(<BaseInput {...defaultProps} type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('deve renderizar input de senha corretamente', () => {
      render(<BaseInput {...defaultProps} type="password" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('deve renderizar input de busca corretamente', () => {
      render(<BaseInput {...defaultProps} type="search" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('deve renderizar input de CPF corretamente', () => {
      render(<BaseInput {...defaultProps} type="cpf" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('maxLength', '14')
    })

    it('deve renderizar input de data corretamente', () => {
      render(<BaseInput {...defaultProps} type="date" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'date')
    })
  })

  describe('Ícones', () => {
    it('deve mostrar ícone de usuário para texto', () => {
      render(<BaseInput {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })

    it('deve mostrar ícone de envelope para email', () => {
      render(<BaseInput {...defaultProps} type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })

    it('deve mostrar ícone de cadeado para senha', () => {
      render(<BaseInput {...defaultProps} type="password" />)
      
      const input = screen.getByDisplayValue('')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })

    it('deve mostrar ícone de busca para search', () => {
      render(<BaseInput {...defaultProps} type="search" />)
      
      const input = screen.getByRole('textbox')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })

    it('deve mostrar ícone de CPF para cpf', () => {
      render(<BaseInput {...defaultProps} type="cpf" />)
      
      const input = screen.getByRole('textbox')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })

    it('deve mostrar ícone de calendário para data', () => {
      render(<BaseInput {...defaultProps} type="date" />)
      
      const input = screen.getByDisplayValue('')
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Interações', () => {
    it('deve chamar onChange quando valor muda', () => {
      const onChange = vi.fn()
      render(<BaseInput {...defaultProps} onChange={onChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('deve mostrar valor fornecido', () => {
      render(<BaseInput {...defaultProps} value="test value" />)
      
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
    })
  })

  describe('Input de senha', () => {
    it('deve mostrar botão de toggle de visibilidade', () => {
      render(<BaseInput {...defaultProps} type="password" />)
      
      const toggleButton = screen.getByRole('button')
      expect(toggleButton).toBeInTheDocument()
    })

    it('deve alternar visibilidade da senha ao clicar no botão', () => {
      render(<BaseInput {...defaultProps} type="password" />)
      
      const input = screen.getByDisplayValue('')
      const toggleButton = screen.getByRole('button')
      
      expect(input).toHaveAttribute('type', 'password')
      
      fireEvent.click(toggleButton)
      
      expect(input).toHaveAttribute('type', 'text')
      
      fireEvent.click(toggleButton)
      
      expect(input).toHaveAttribute('type', 'password')
    })
  })

  describe('Input de CPF', () => {
    it('deve formatar CPF automaticamente', () => {
      const onChange = vi.fn()
      render(<BaseInput {...defaultProps} type="cpf" onChange={onChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '12345678901' } })
      
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: '123.456.789-01'
          })
        })
      )
    })

    it('deve limitar CPF a 11 dígitos', () => {
      const onChange = vi.fn()
      render(<BaseInput {...defaultProps} type="cpf" onChange={onChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '123456789012345' } })
      
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: '123.456.789-01'
          })
        })
      )
    })
  })

  describe('Input de busca', () => {
    it('deve mostrar indicador de loading quando fornecido', () => {
      render(<BaseInput {...defaultProps} type="search" loading={true} />)
      
      const loadingSpinner = screen.getByRole('textbox').parentElement?.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })

    it('não deve mostrar indicador de loading quando loading é false', () => {
      render(<BaseInput {...defaultProps} type="search" loading={false} />)
      
      const loadingSpinner = screen.getByRole('textbox').parentElement?.querySelector('.animate-spin')
      expect(loadingSpinner).not.toBeInTheDocument()
    })
  })

  describe('Estados', () => {
    it('deve mostrar erro quando fornecido', () => {
      render(<BaseInput {...defaultProps} error="Test error message" />)
      
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('deve aplicar classe de erro ao input', () => {
      render(<BaseInput {...defaultProps} error="Test error" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-300')
    })

    it('deve desabilitar input quando disabled é true', () => {
      render(<BaseInput {...defaultProps} disabled={true} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('deve aplicar classe de disabled quando desabilitado', () => {
      render(<BaseInput {...defaultProps} disabled={true} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('bg-gray-50', 'cursor-not-allowed')
    })

    it('deve marcar como required quando fornecido', () => {
      render(<BaseInput {...defaultProps} required={true} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })
  })

  describe('Indicador de obrigatório', () => {
    it('deve mostrar indicador de obrigatório quando required e showRequiredIndicator são true', () => {
      render(<BaseInput {...defaultProps} required={true} showRequiredIndicator={true} />)
      
      expect(screen.getByText('(obrigatório)')).toBeInTheDocument()
    })

    it('não deve mostrar indicador quando showRequiredIndicator é false', () => {
      render(<BaseInput {...defaultProps} required={true} showRequiredIndicator={false} />)
      
      expect(screen.queryByText('(obrigatório)')).not.toBeInTheDocument()
    })

    it('não deve mostrar indicador quando required é false', () => {
      render(<BaseInput {...defaultProps} required={false} showRequiredIndicator={true} />)
      
      expect(screen.queryByText('(obrigatório)')).not.toBeInTheDocument()
    })
  })

  describe('Input de data', () => {
    it('deve aplicar min e max quando fornecidos', () => {
      render(
        <BaseInput 
          {...defaultProps} 
          type="date" 
          min="2020-01-01" 
          max="2023-12-31" 
        />
      )
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('min', '2020-01-01')
      expect(input).toHaveAttribute('max', '2023-12-31')
    })

    it('não deve aplicar min e max para outros tipos', () => {
      render(
        <BaseInput 
          {...defaultProps} 
          type="text" 
          min="2020-01-01" 
          max="2023-12-31" 
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveAttribute('min')
      expect(input).not.toHaveAttribute('max')
    })
  })

  describe('AutoComplete', () => {
    it('deve aplicar autoComplete quando fornecido', () => {
      render(<BaseInput {...defaultProps} autoComplete="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })
  })

  describe('MaxLength', () => {
    it('deve aplicar maxLength quando fornecido', () => {
      render(<BaseInput {...defaultProps} maxLength={50} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '50')
    })

    it('deve sobrescrever maxLength para CPF', () => {
      render(<BaseInput {...defaultProps} type="cpf" maxLength={50} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '14')
    })
  })
}) 