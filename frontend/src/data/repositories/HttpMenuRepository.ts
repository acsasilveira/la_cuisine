import { api } from "../../lib/api";
import { Menu } from "../../domain/entities/Menu";
import { MenuRepository, MenuSuggestionResponse } from "../../domain/repositories/MenuRepository";
import { MenuMapper } from "../mappers/MenuMapper";
import { MenuDTO, MenuSuggestionResponseDTO } from "../dtos/MenuDTO";

export class HttpMenuRepository implements MenuRepository {
  async getMenus(): Promise<Menu[]> {
    const response = await api.get<MenuDTO[]>("/api/menus");
    return response.data.map(dto => MenuMapper.toDomain(dto));
  }

  async createMenu(menu: Omit<Menu, "id" | "createdAt">): Promise<Menu> {
    const dto = MenuMapper.toCreateDTO(menu);
    const response = await api.post<MenuDTO>("/api/menus", dto);
    return MenuMapper.toDomain(response.data);
  }

  async deleteMenu(id: string): Promise<void> {
    await api.delete(`/api/menus/${id}`);
  }

  async suggestMenu(recipeId: string, category: string): Promise<MenuSuggestionResponse> {
    const response = await api.post<MenuSuggestionResponseDTO>("/api/menus/suggest", {
      recipe_id: recipeId,
      category,
    });
    return MenuMapper.toSuggestionDomain(response.data);
  }
}
