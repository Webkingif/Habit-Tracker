import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { STORAGE_KEYS } from '@/lib/constants';
import React from 'react';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockPush.mockClear();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    const session = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('test@example.com');
  });

  it('shows an error for duplicate signup email', async () => {
    // Pre-seed a user
    const existingUsers = [{ id: '1', email: 'test@example.com', password: 'p', createdAt: '' }];
    window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));

    render(<SignupForm />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeDefined();
    });
  });

  it('submits the login form and stores the active session', async () => {
    // Pre-seed a user
    const users = [{ id: '1', email: 'test@example.com', password: 'password123', createdAt: '' }];
    window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    const session = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    expect(session.email).toBe('test@example.com');
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeDefined();
    });
  });
});
