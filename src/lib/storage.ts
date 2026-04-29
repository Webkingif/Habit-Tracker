import { STORAGE_KEYS } from './constants';
import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

// Generic helper to get from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Generic helper to set to localStorage
const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// Users
export const getUsers = (): User[] => getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
export const saveUsers = (users: User[]): void => setToStorage(STORAGE_KEYS.USERS, users);

// Session
export const getSession = (): Session | null => getFromStorage<Session | null>(STORAGE_KEYS.SESSION, null);
export const saveSession = (session: Session | null): void => setToStorage(STORAGE_KEYS.SESSION, session);
export const clearSession = (): void => saveSession(null);

// Habits
export const getHabits = (): Habit[] => getFromStorage<Habit[]>(STORAGE_KEYS.HABITS, []);
export const saveHabits = (habits: Habit[]): void => setToStorage(STORAGE_KEYS.HABITS, habits);

export const getHabitsByUserId = (userId: string): Habit[] => {
  return getHabits().filter(habit => habit.userId === userId);
};
