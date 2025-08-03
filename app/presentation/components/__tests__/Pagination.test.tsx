import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
    totalItems: 100,
    itemsPerPage: 10,
    hasPrevious: false,
    hasNext: true
  }

  it('deve renderizar informações de paginação', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByText('Mostrando 1 a 10 de 100 resultados')).toBeInTheDocument()
  })

  it('deve chamar onPageChange quando próxima página é clicada', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} hasNext={true} />)
    
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1] // último botão é o próximo
    fireEvent.click(nextButton)
    
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('deve chamar onPageChange quando página anterior é clicada', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} hasPrevious={true} />)
    
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0] // primeiro botão é o anterior
    fireEvent.click(prevButton)
    
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('deve desabilitar botão anterior quando hasPrevious é false', () => {
    render(<Pagination {...defaultProps} hasPrevious={false} />)
    
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0]
    expect(prevButton).toBeDisabled()
  })

  it('deve desabilitar botão próximo quando hasNext é false', () => {
    render(<Pagination {...defaultProps} hasNext={false} />)
    
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('deve chamar onPageChange quando número da página é clicado', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    
    const pageButton = screen.getByText('3')
    fireEvent.click(pageButton)
    
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('não deve renderizar quando totalPages é 1', () => {
    render(<Pagination {...defaultProps} totalPages={1} />)
    
    expect(screen.queryByText('Mostrando')).not.toBeInTheDocument()
  })
}) 