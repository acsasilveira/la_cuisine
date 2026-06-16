import { User } from "../../domain/entities/User";
import { UserDTO } from "../dtos/UserDTO";

export class UserMapper {
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      fullName: dto.full_name,
      phone: dto.phone || undefined,
      location: dto.location || undefined,
      specialty: dto.specialty || undefined,
    };
  }

  static toDTO(domain: User): UserDTO {
    return {
      id: domain.id || "",
      email: domain.email,
      full_name: domain.fullName,
      phone: domain.phone || null,
      location: domain.location || null,
      specialty: domain.specialty || null,
    };
  }
}
