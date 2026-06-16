import { User } from "../entities/User";

export interface AuthRepository {
  getMe(): Promise<User>;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  register(email: string, password: string, fullName: string): Promise<void>;
  updateProfile(
    fullName: string,
    phone?: string | null,
    location?: string | null,
    specialty?: string | null
  ): Promise<User>;
}
