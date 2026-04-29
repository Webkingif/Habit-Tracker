import { User, Session } from '@/types/auth';
import { getUsers, saveUsers, saveSession, clearSession } from './storage';

export async function signup(email: string, password: string): Promise<void> {
  const users = getUsers();
  
  if (users.some((u) => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
}

export async function login(email: string, password: string): Promise<Session> {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  saveSession(session);
  return session;
}

export function logout(): void {
  clearSession();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
