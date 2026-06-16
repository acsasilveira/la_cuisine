import { Menu } from "../entities/Menu";

export interface SuggestedDish {
  name: string;
  isNew: boolean;
}

export interface SuggestedMenu {
  justificativa: string;
  entrada: SuggestedDish;
  principal: SuggestedDish;
  sobremesa: SuggestedDish;
}

export interface MenuSuggestionResponse {
  menus: SuggestedMenu[];
}

export interface MenuRepository {
  getMenus(): Promise<Menu[]>;
  createMenu(menu: Omit<Menu, "id" | "createdAt">): Promise<Menu>;
  deleteMenu(id: string): Promise<void>;
  suggestMenu(recipeId: string, category: string): Promise<MenuSuggestionResponse>;
}
