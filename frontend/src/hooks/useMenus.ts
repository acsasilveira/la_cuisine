import { useState, useCallback } from "react";
import { Menu } from "../domain/entities/Menu";
import { HttpMenuRepository } from "../data/repositories/HttpMenuRepository";

const menuRepository = new HttpMenuRepository();

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await menuRepository.getMenus();
      setMenus(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number } };
      if (apiError.response?.status === 401) {
        setError("Faça login para ver seus menus.");
      } else {
        setError("Erro ao carregar menus.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenu = useCallback(async (newMenu: Omit<Menu, "id" | "createdAt">) => {
    setLoading(true);
    setError("");
    try {
      const created = await menuRepository.createMenu(newMenu);
      setMenus(prev => [created, ...prev]);
      return created;
    } catch {
      const msg = "Erro ao salvar menu.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMenu = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    try {
      await menuRepository.deleteMenu(id);
      setMenus(prev => prev.filter(m => m.id !== id));
    } catch {
      const msg = "Falha ao deletar menu.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestMenu = useCallback(async (recipeId: string, category: string) => {
    setLoading(true);
    setError("");
    try {
      const suggestion = await menuRepository.suggestMenu(recipeId, category);
      return suggestion;
    } catch {
      const msg = "Erro ao sugerir menu com IA. Tem certeza que a API Key é válida?";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    menus,
    loading,
    error,
    setError,
    fetchMenus,
    createMenu,
    deleteMenu,
    suggestMenu,
  };
}
