
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface UserAccount extends UserProfile {
  password?: string; // Only used for the local "database" simulation
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

// Represents the data stored for each specific user
export interface UserData {
  lists: ShoppingList[];
  activeListId: string | null;
  fliers?: Record<string, string>; // Store market flier URLs (Market Name -> PDF URL)
}

export interface AppState {
  user: UserProfile | null;
  lists: ShoppingList[];
  activeListId: string | null;
  fliers: Record<string, string>;
}

// The full structure of our local "Database"
export interface MockDatabase {
  accounts: UserAccount[];
  contentStore: Record<string, UserData>; // Key is user ID
}
