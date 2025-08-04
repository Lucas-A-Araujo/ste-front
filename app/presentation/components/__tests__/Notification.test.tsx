import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Notification } from '../Notification'

describe('Notification', () => {
  it('deve renderizar mensagem', () => {
    render(
      <Notification
        type="success"
        message="Test message"
        onClose={vi.fn()}
        show={true}
      />
    )
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('deve chamar onClose quando clicado', () => {
    const onClose = vi.fn()
    
    render(
      <Notification
        type="success"
        message="Test message"
        onClose={onClose}
        show={true}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(onClose).toHaveBeenCalled()
  })
}) 