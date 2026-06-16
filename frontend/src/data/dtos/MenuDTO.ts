export interface MenuItemDTO {
  id?: string;
  category: string;
  recipe_name: string;
  is_new: boolean;
}

export interface MenuDTO {
  id: string;
  title: string;
  occasion: string | null;
  created_at: string;
  items: MenuItemDTO[];
}

export interface MenuCreateDTO {
  title: string;
  occasion: string | null;
  items: MenuItemDTO[];
}

export interface MenuItemSuggestDTO {
  name: string;
  is_new: boolean;
}

export interface MenuEntrySuggestDTO {
  entrada: MenuItemSuggestDTO;
  principal: MenuItemSuggestDTO;
  sobremesa: MenuItemSuggestDTO;
  justificativa: string;
}

export interface MenuSuggestionResponseDTO {
  menus: MenuEntrySuggestDTO[];
}
