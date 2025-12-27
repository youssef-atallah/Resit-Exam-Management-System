import { User } from '../../types';

export interface UserDao {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserWithRole(identifier: string): Promise<{ user: User; role: 'student' | 'instructor' | 'secretary' } | undefined>;
  signInHandler(id: string, password: string): Promise<User | null>;
}