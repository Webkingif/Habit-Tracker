import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitList from '@/components/habits/HabitList';
import { STORAGE_KEYS } from '@/lib/constants';
import React from 'react';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('habit form', () => {
  const mockUser = { userId: 'user123', email: 'test@example.com' };

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockUser));
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<HabitList />);
    
    // Open the form
    fireEvent.click(await screen.findByTestId('create-habit-button'));
    
    // Submit empty
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('Habit name is required')).toBeDefined();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<HabitList />);
    
    fireEvent.click(await screen.findByTestId('create-habit-button'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Drink Water' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeDefined();
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const habit = {
      id: 'h1',
      userId: 'user123',
      name: 'Old Name',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00Z',
      completions: []
    };
    window.localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([habit]));

    render(<HabitList />);
    
    fireEvent.click(await screen.findByTestId('habit-edit-old-name'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-new-name')).toBeDefined();
    });

    const habits = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
    expect(habits[0].id).toBe('h1'); // Preserved ID
    expect(habits[0].createdAt).toBe('2024-01-01T00:00:00Z'); // Preserved createdAt
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit = {
      id: 'h1',
      userId: 'user123',
      name: 'Delete Me',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00Z',
      completions: []
    };
    window.localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([habit]));

    render(<HabitList />);
    
    fireEvent.click(await screen.findByTestId('habit-delete-delete-me'));
    
    // Check for confirmation text
    expect(screen.getByText(/Are you sure you want to delete/)).toBeDefined();
    
    // Confirm delete
    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-delete-me')).toBeNull();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    const habit = {
      id: 'h1',
      userId: 'user123',
      name: 'Streak Habit',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00Z',
      completions: []
    };
    window.localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([habit]));

    render(<HabitList />);
    
    const completeBtn = await screen.findByTestId('habit-complete-streak-habit');
    fireEvent.click(completeBtn);

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-streak-habit').textContent).toContain('Streak: 1');
    });

    // Toggle off
    fireEvent.click(completeBtn);
    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-streak-habit').textContent).toContain('Streak: 0');
    });
  });
});
