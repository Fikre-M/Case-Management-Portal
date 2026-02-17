import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick} disabled>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with primary variant by default', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button.className).toContain('bg-primary-600')
  })

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button.className).toContain('bg-gray-200')
  })

  it('should render with danger variant', () => {
    render(<Button variant="danger">Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button.className).toContain('bg-red-600')
  })

  it('should render with ghost variant', () => {
    render(<Button variant="ghost">Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button.className).toContain('bg-transparent')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByText('Small').className).toContain('px-3')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByText('Medium').className).toContain('px-4')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByText('Large').className).toContain('px-6')
  })

  it('should show loading spinner when loading', () => {
    render(<Button loading>Click me</Button>)
    // LoadingSpinner should be rendered
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should be disabled when loading', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick} loading>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with custom className', () => {
    render(<Button className="custom-class">Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button.className).toContain('custom-class')
  })

  it('should render as submit button', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByText('Submit')
    expect(button.type).toBe('submit')
  })

  it('should have aria-label', () => {
    render(<Button aria-label="Custom label">Click me</Button>)
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
  })

  it('should have aria-disabled when disabled', () => {
    render(<Button disabled>Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })
})
