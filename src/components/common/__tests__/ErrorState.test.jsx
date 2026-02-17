import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from '../ErrorState'

describe('ErrorState Component', () => {
  it('should render error message', () => {
    render(<ErrorState error="Test error message" />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should render default title', () => {
    render(<ErrorState error="Test error" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render custom title', () => {
    render(<ErrorState error="Test error" title="Custom Title" />)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('should render error from Error object', () => {
    const error = new Error('Error object message')
    render(<ErrorState error={error} />)
    expect(screen.getByText('Error object message')).toBeInTheDocument()
  })

  it('should render default message for unknown error', () => {
    render(<ErrorState error={{}} />)
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
  })

  it('should render retry button when onRetry provided', () => {
    const onRetry = vi.fn()
    render(<ErrorState error="Test error" onRetry={onRetry} />)
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
  })

  it('should not render retry button when onRetry not provided', () => {
    render(<ErrorState error="Test error" />)
    expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
  })

  it('should call onRetry when retry button clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(<ErrorState error="Test error" onRetry={onRetry} />)
    
    await user.click(screen.getByText(/try again/i))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should have role alert', () => {
    render(<ErrorState error="Test error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should have aria-live assertive', () => {
    render(<ErrorState error="Test error" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })

  it('should render with custom className', () => {
    render(<ErrorState error="Test error" className="custom-class" />)
    const container = screen.getByRole('alert').parentElement
    expect(container.className).toContain('custom-class')
  })

  it('should show error details when showDetails is true', () => {
    const error = { message: 'Test', code: 500 }
    render(<ErrorState error={error} showDetails={true} />)
    // Should render Alert component with error details
    expect(screen.getByText(/Test/)).toBeInTheDocument()
  })

  it('should not show error details by default', () => {
    const error = { message: 'Test', code: 500 }
    render(<ErrorState error={error} />)
    // Should only show the message, not the full object
    expect(screen.queryByText(/code/i)).not.toBeInTheDocument()
  })
})
