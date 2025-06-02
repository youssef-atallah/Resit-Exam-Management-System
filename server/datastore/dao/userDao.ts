import { User } from '../../types';

export interface UserDao {

  signInHandler(id: string, password: string): Promise<User | null>;
  

}