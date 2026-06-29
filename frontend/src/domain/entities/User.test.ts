import { describe, it, expect } from "vitest";
import { validateEmail, validateUser } from "./User";

describe("User Entity Validation", () => {
  describe("validateEmail", () => {
    it("should return true for a valid email", () => {
      expect(validateEmail("chef@lacuisine.com")).toBe(true);
      expect(validateEmail("admin.123@domain.org")).toBe(true);
    });

    it("should return false for an invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("chef@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("chef@domain.")).toBe(false);
    });
  });

  describe("validateUser", () => {
    it("should return no errors for a valid user payload", () => {
      const result = validateUser({
        fullName: "Chef LaCuisine",
        email: "chef@lacuisine.com",
        password: "securepassword123",
      });
      expect(result).toEqual({});
    });

    it("should return error if fullName has less than 3 characters", () => {
      const result = validateUser({
        fullName: "Ch",
      });
      expect(result.fullName).toBe("O nome completo deve ter pelo menos 3 caracteres.");
    });

    it("should return error if email is empty", () => {
      const result = validateUser({
        email: "   ",
      });
      expect(result.email).toBe("O e-mail é obrigatório.");
    });

    it("should return error if email format is invalid", () => {
      const result = validateUser({
        email: "invalid-email",
      });
      expect(result.email).toBe("E-mail inválido.");
    });

    it("should return error if password is less than 6 characters", () => {
      const result = validateUser({
        password: "12345",
      });
      expect(result.password).toBe("A senha deve ter pelo menos 6 caracteres.");
    });
  });
});
