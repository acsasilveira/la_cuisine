import { describe, it, expect } from "vitest";
import { validateMenu } from "./Menu";

describe("Menu Entity Validation", () => {
  it("should return no errors for a valid menu", () => {
    const result = validateMenu({
      title: "Menu Especial",
      occasion: "Jantar Romântico",
      items: [
        { category: "Entrada", recipeName: "Bruschetta", isNew: false },
        { category: "Prato Principal", recipeName: "Risoto de Funghi", isNew: false },
      ],
    });
    expect(result).toEqual({});
  });

  it("should return error if title has less than 3 characters", () => {
    const result = validateMenu({
      title: "Me",
      items: [{ category: "Entrada", recipeName: "Bruschetta", isNew: false }],
    });
    expect(result.title).toBe("O título do menu deve ter pelo menos 3 caracteres.");
  });

  it("should return error if occasion exceeds 100 characters", () => {
    const longOccasion = "a".repeat(101);
    const result = validateMenu({
      title: "Menu Especial",
      occasion: longOccasion,
      items: [{ category: "Entrada", recipeName: "Bruschetta", isNew: false }],
    });
    expect(result.occasion).toBe("A ocasião não deve exceder 100 caracteres.");
  });

  it("should return error if items list is empty", () => {
    const result = validateMenu({
      title: "Menu Especial",
      items: [],
    });
    expect(result.items).toBe("O menu deve ter pelo menos um prato listado.");
  });

  it("should return error if any menu item has an empty recipe name", () => {
    const result = validateMenu({
      title: "Menu Especial",
      items: [
        { category: "Entrada", recipeName: "   ", isNew: false },
      ],
    });
    expect(result.items).toBe("Todos os itens do menu devem ter um nome de receita.");
  });
});
