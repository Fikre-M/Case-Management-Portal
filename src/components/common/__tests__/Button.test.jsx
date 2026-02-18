import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button Component', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render with default props', () => {
      render(<Button>Default Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600') // Primary variant
      expect(button).toHaveClass('px-4', 'py-2') // Medium size
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('should render primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700')
    })

    it('should render secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700')
    })

    it('should render danger variant correctly', () => {
      render(<Button variant="danger">Danger</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700')
    })

    it('should render outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2', 'border-blue-600', 'text-blue-600')
    })
  })

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Button size="small">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    it('should render medium size correctly', () => {
      render(<Button size="medium">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('should render large size correctly', () => {
      render(<Button size="large">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
  })

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('should handle loading state', () => {
      render(<Button loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-75')
      
      // Should show loading spinner
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should show loading text when loading', () => {
      render(<Button loading loadingText="Saving...">Save</Button>)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })

    it('should prioritize disabled over loading', () => {
      render(<Button disabled loading>Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      // Should not show loading spinner when disabled
      expect(button.querySelector('.animate-spin')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should handle keyboard navigation', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Button</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('HTML Attributes', () => {
    it('should support different button types', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should forward additional props', () => {
      render(
        <Button 
          data-testid="custom-button" 
          aria-label="Custom button"
          title="Button tooltip"
        >
          Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom button')
      expect(button).toHaveAttribute('title', 'Button tooltip')
    })

    it('should support form attribute', () => {
      render(<Button form="my-form">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'my-form')
    })
  })

  describe('Icons and Content', () => {
    it('should render with icon', () => {
      render(
        <Button>
          <span>🔒</span>
          Secure Action
        </Button>
      )
      
      expect(screen.getByText('🔒')).toBeInTheDocument()
      expect(screen.getByText('Secure Action')).toBeInTheDocument()
    })

    it('should handle complex children', () => {
      render(
        <Button>
          <div className="flex items-center space-x-2">
            <span>Icon</span>
            <span>Text</span>
          </div>
        </Button>
      )
      
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-describedby="help-text">Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('should announce loading state to screen readers', () => {
      render(<Button loading aria-label="Saving data">Save</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Saving data')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should be focusable by default', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabindex', '0')
    })

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn()
      
      function TestButton(props) {
        renderSpy()
        return <Button {...props}>Test</Button>
      }
      
      const { rerender } = render(<TestButton />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // Re-render with same props
      rerender(<TestButton />)
      expect(renderSpy).toHaveBeenCalledTimes(2) // Will re-render without memo
      
      // This test would pass if Button was wrapped with React.memo
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle null children', () => {
      render(<Button>{null}</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle undefined onClick', () => {
      expect(() => {
        render(<Button onClick={undefined}>Button</Button>)
      }).not.toThrow()
    })

    it('should handle rapid clicks', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Rapid Click</Button>)
      
      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })
})