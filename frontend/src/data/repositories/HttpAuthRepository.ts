import { api } from "../../lib/api";
import { User } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { UserMapper } from "../mappers/UserMapper";
import { UserDTO } from "../dtos/UserDTO";

export class HttpAuthRepository implements AuthRepository {
  async getMe(): Promise<User> {
    const response = await api.get<UserDTO>("/api/auth/me");
    return UserMapper.toDomain(response.data);
  }

  async login(email: string, password: string): Promise<void> {
    await api.post("/api/auth/login", { email, password });
  }

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  }

  async register(email: string, password: string, fullName: string): Promise<void> {
    await api.post("/api/auth/register", {
      email,
      password,
      full_name: fullName,
    });
  }

  async updateProfile(
    fullName: string,
    phone?: string | null,
    location?: string | null,
    specialty?: string | null
  ): Promise<User> {
    const response = await api.put<UserDTO>("/api/auth/profile", {
      full_name: fullName,
      phone: phone || null,
      location: location || null,
      specialty: specialty || null,
    });
    return UserMapper.toDomain(response.data);
  }
}
