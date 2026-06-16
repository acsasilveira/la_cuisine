import { Menu, MenuItem } from "../../domain/entities/Menu";
import { MenuSuggestionResponse, SuggestedMenu } from "../../domain/repositories/MenuRepository";
import { MenuDTO, MenuCreateDTO, MenuSuggestionResponseDTO } from "../dtos/MenuDTO";

export class MenuMapper {
  static toDomain(dto: MenuDTO): Menu {
    const items: MenuItem[] = dto.items.map(item => ({
      id: item.id,
      category: item.category,
      recipeName: item.recipe_name,
      isNew: item.is_new,
    }));

    return {
      id: dto.id,
      title: dto.title,
      occasion: dto.occasion,
      createdAt: dto.created_at,
      items,
    };
  }

  static toCreateDTO(domain: Omit<Menu, "id" | "createdAt">): MenuCreateDTO {
    const items = domain.items.map(item => ({
      category: item.category,
      recipe_name: item.recipeName,
      is_new: item.isNew,
    }));

    return {
      title: domain.title,
      occasion: domain.occasion,
      items,
    };
  }

  static toSuggestionDomain(dto: MenuSuggestionResponseDTO): MenuSuggestionResponse {
    const menus: SuggestedMenu[] = dto.menus.map(entry => ({
      justificativa: entry.justificativa,
      entrada: {
        name: entry.entrada.name,
        isNew: entry.entrada.is_new,
      },
      principal: {
        name: entry.principal.name,
        isNew: entry.principal.is_new,
      },
      sobremesa: {
        name: entry.sobremesa.name,
        isNew: entry.sobremesa.is_new,
      },
    }));

    return { menus };
  }
}
