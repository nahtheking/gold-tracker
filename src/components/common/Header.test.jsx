import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

describe('Header Component', () => {
  it('should render header with user email', () => {
    const mockUser = { email: 'test@example.com' };
    const mockOnLogout = vi.fn();

    render(<Header user={mockUser} onLogout={mockOnLogout} />);

    // Check if logo and title are displayed
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('Quản Lý Vàng')).toBeInTheDocument();

    // Check if user email is displayed
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    // Check if logout button is displayed
    expect(screen.getByText('Đăng xuất')).toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', async () => {
    const mockUser = { email: 'test@example.com' };
    const mockOnLogout = vi.fn();
    const user = userEvent.setup();

    render(<Header user={mockUser} onLogout={mockOnLogout} />);

    const logoutButton = screen.getByText('Đăng xuất');
    await user.click(logoutButton);

    // Check if onLogout was called
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('should render correctly with different user', () => {
    const mockUser = { email: 'another@example.com' };
    const mockOnLogout = vi.fn();

    render(<Header user={mockUser} onLogout={mockOnLogout} />);

    expect(screen.getByText('another@example.com')).toBeInTheDocument();
  });
});
