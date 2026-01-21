import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastContainer, useToast } from './Toast'

describe('Toast Component', () => {
  describe('ToastContainer', () => {
    it('should render toast items', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Success message',
          type: 'success' as const,
          duration: 5000,
        },
      ]
      const mockOnDismiss = jest.fn()

      render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={mockOnDismiss}
        />
      )

      expect(screen.getByText('Success message')).toBeInTheDocument()
    })

    it('should render multiple toasts', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'First message',
          type: 'success' as const,
          duration: 5000,
        },
        {
          id: '2',
          message: 'Second message',
          type: 'error' as const,
          duration: 5000,
        },
      ]
      const mockOnDismiss = jest.fn()

      render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={mockOnDismiss}
        />
      )

      expect(screen.getByText('First message')).toBeInTheDocument()
      expect(screen.getByText('Second message')).toBeInTheDocument()
    })

    it('should call onDismiss when close button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnDismiss = jest.fn()
      const mockToasts = [
        {
          id: '1',
          message: 'Test message',
          type: 'success' as const,
          duration: 5000,
        },
      ]

      render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={mockOnDismiss}
        />
      )

      // Find and click the close button
      const closeButtons = screen.getAllByRole('button')
      await user.click(closeButtons[0])

      expect(mockOnDismiss).toHaveBeenCalledWith('1')
    })

    it('should render success toast with correct styling', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Success',
          type: 'success' as const,
          duration: 5000,
        },
      ]

      const { container } = render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={jest.fn()}
        />
      )

      const toast = container.querySelector('.bg-green-50')
      expect(toast).toBeInTheDocument()
    })

    it('should render error toast with correct styling', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Error',
          type: 'error' as const,
          duration: 5000,
        },
      ]

      const { container } = render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={jest.fn()}
        />
      )

      const toast = container.querySelector('.bg-red-50')
      expect(toast).toBeInTheDocument()
    })

    it('should render info toast with correct styling', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Info',
          type: 'info' as const,
          duration: 5000,
        },
      ]

      const { container } = render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={jest.fn()}
        />
      )

      const toast = container.querySelector('.bg-blue-50')
      expect(toast).toBeInTheDocument()
    })

    it('should render warning toast with correct styling', () => {
      const mockToasts = [
        {
          id: '1',
          message: 'Warning',
          type: 'warning' as const,
          duration: 5000,
        },
      ]

      const { container } = render(
        <ToastContainer
          toasts={mockToasts}
          onDismiss={jest.fn()}
        />
      )

      const toast = container.querySelector('.bg-yellow-50')
      expect(toast).toBeInTheDocument()
    })

    it('should render empty container when no toasts', () => {
      const { container } = render(
        <ToastContainer
          toasts={[]}
          onDismiss={jest.fn()}
        />
      )

      const toastContainer = container.querySelector('.space-y-3')
      expect(toastContainer?.children.length).toBe(0)
    })
  })

  describe('useToast Hook', () => {
    it('should be defined', () => {
      expect(useToast).toBeDefined()
      expect(typeof useToast).toBe('function')
    })

    it('should initialize with empty toasts array', () => {
      const TestComponent = () => {
        const { toasts } = useToast()
        return <div>{toasts.length}</div>
      }

      render(<TestComponent />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
