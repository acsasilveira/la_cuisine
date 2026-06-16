export interface MenuItem {
  id?: string;
  category: string;
  recipeName: string;
  isNew: boolean;
}

export interface Menu {
  id?: string;
  title: string;
  occasion: string | null;
  createdAt?: string;
  items: MenuItem[];
}

export interface MenuValidationError {
  title?: string;
  occasion?: string;
  items?: string;
}

export function validateMenu(menu: Partial<Menu>): MenuValidationError {
  const errors: MenuValidationError = {};

  if (!menu.title || menu.title.trim().length < 3) {
    errors.title = "O título do menu deve ter pelo menos 3 caracteres.";
  }

  if (menu.occasion && menu.occasion.trim().length > 100) {
    errors.occasion = "A ocasião não deve exceder 100 caracteres.";
  }

  if (!menu.items || menu.items.length === 0) {
    errors.items = "O menu deve ter pelo menos um prato listado.";
  } else {
    const hasInvalidItem = menu.items.some(item => !item.recipeName || item.recipeName.trim() === "");
    if (hasInvalidItem) {
      errors.items = "Todos os itens do menu devem ter um nome de receita.";
    }
  }

  return errors;
}
