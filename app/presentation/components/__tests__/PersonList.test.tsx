import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PersonList } from '../PersonList'

// Mock do SVG
vi.mock('../../../assets/undraw_no-data_ig65.svg', () => 'mocked-svg')

describe('PersonList', () => {
  const mockPerson = {
    id: '1',
    nome: 'João Silva',
    cpf: '12345678901',
    email: 'joao@email.com',
    dataNascimento: '1990-01-01',
    sexo: 'M',
    naturalidade: 'São Paulo',
    nacionalidade: 'Brasileira'
  }

  const defaultProps = {
    persons: [mockPerson],
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    loading: false
  }

  it('deve renderizar lista de pessoas', () => {
    render(<PersonList {...defaultProps} />)
    
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@email.com')).toBeInTheDocument()
  })

  it('deve mostrar loading quando loading é true', () => {
    render(<PersonList {...defaultProps} loading={true} />)
    
    expect(screen.getByText('Carregando pessoas...')).toBeInTheDocument()
  })

  it('deve mostrar mensagem quando não há pessoas', () => {
    render(<PersonList {...defaultProps} persons={[]} />)
    
    expect(screen.getByText('Nenhuma pessoa cadastrada')).toBeInTheDocument()
    expect(screen.getByText('Comece adicionando uma nova pessoa ao sistema.')).toBeInTheDocument()
  })

  it('deve chamar onEdit quando botão editar é clicado', () => {
    const onEdit = vi.fn()
    render(<PersonList {...defaultProps} onEdit={onEdit} />)
    
    const editButton = screen.getByText('Editar')
    fireEvent.click(editButton)
    
    expect(onEdit).toHaveBeenCalledWith(mockPerson)
  })

  it('deve chamar onDelete quando botão excluir é clicado', () => {
    const onDelete = vi.fn()
    render(<PersonList {...defaultProps} onDelete={onDelete} />)
    
    const deleteButton = screen.getByText('Excluir')
    fireEvent.click(deleteButton)
    
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('deve mostrar paginação quando fornecida', () => {
    const pagination = {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
      hasPrevious: false,
      hasNext: true
    }
    
    render(<PersonList {...defaultProps} pagination={pagination} onPageChange={vi.fn()} />)
    
    expect(screen.getByText('Mostrando 1 a 10 de 100 resultados')).toBeInTheDocument()
  })

  it('deve mostrar "-" quando email não existe', () => {
    const personWithoutEmail = { ...mockPerson, email: undefined }
    render(<PersonList {...defaultProps} persons={[personWithoutEmail]} />)
    
    expect(screen.getByText('-')).toBeInTheDocument()
  })
}) 