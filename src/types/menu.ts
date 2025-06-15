export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  permissions?: string[];
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  label: string;
  order: number;
  isActive: boolean;
  items: MenuItem[];
}

export interface CreateMenuItemRequest {
  label: string;
  icon: string;
  path: string;
  parentId?: string;
  order: number;
  permissions?: string[];
}

export interface UpdateMenuItemRequest {
  id?: string;
  label?: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order?: number;
  isActive?: boolean;
  permissions?: string[];
}
