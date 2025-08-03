import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ConfirmModal } from '../ConfirmModal'

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Test Title',
    message: 'Test Message'
  }

  it('não deve renderizar quando isOpen é false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('deve renderizar título e mensagem', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('deve chamar onClose quando cancelar é clicado', () => {
    const onClose = vi.fn()
    render(<ConfirmModal {...defaultProps} onClose={onClose} />)
    
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('deve chamar onConfirm quando confirmar é clicado', () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />)
    
    const confirmButton = screen.getByText('Confirmar')
    fireEvent.click(confirmButton)
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('deve usar textos customizados', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Sim"
        cancelText="Não"
      />
    )
    
    expect(screen.getByText('Sim')).toBeInTheDocument()
    expect(screen.getByText('Não')).toBeInTheDocument()
  })

  it('deve mostrar loading no botão confirmar', () => {
    render(<ConfirmModal {...defaultProps} loading={true} />)
    expect(screen.getByText('Processando...')).toBeInTheDocument()
  })

  it('deve chamar onClose quando overlay é clicado', () => {
    const onClose = vi.fn()
    render(<ConfirmModal {...defaultProps} onClose={onClose} />)
    
    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })
}) 