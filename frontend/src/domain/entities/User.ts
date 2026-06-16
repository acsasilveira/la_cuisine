export interface User {
  id?: string;
  email: string;
  fullName: string;
  phone?: string;
  location?: string;
  specialty?: string;
}

export interface UserValidationError {
  email?: string;
  fullName?: string;
  password?: string;
  phone?: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUser(user: Partial<User> & { password?: string }): UserValidationError {
  const errors: UserValidationError = {};

  if (user.fullName !== undefined && user.fullName.trim().length < 3) {
    errors.fullName = "O nome completo deve ter pelo menos 3 caracteres.";
  }

  if (user.email !== undefined) {
    if (!user.email.trim()) {
      errors.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(user.email)) {
      errors.email = "E-mail inválido.";
    }
  }

  if (user.password !== undefined && user.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  return errors;
}
