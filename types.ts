
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  completed: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  status: 'active' | 'completed' | 'cancelled';
  totalEstimated: number;
}

export interface AppState {
  user: UserProfile | null;
  lists: ShoppingList[];
  activeListId: string | null;
}
