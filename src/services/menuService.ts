import { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '../types/menu';
import api from './api';  // axios instance

export const menuService = {
  async getMenuItems(forceRefresh?: boolean): Promise<MenuItem[]> {
    const res = await api.get<MenuItem[]>('/api/menus');
    return res.data;
  },

  async createMenu(data: CreateMenuItemRequest): Promise<MenuItem> {
    const res = await api.post<MenuItem>('/api/menus', data);
    return res.data;
  },

  async updateMenu(id: string, data: UpdateMenuItemRequest): Promise<MenuItem> {
    const res = await api.put<MenuItem>(`/api/menus/${id}`, data);
    return res.data;
  },

  async deleteMenu(id: string): Promise<void> {
    await api.delete(`/api/menus/${id}`);
  }
};