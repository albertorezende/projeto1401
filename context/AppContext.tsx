
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ShoppingList, ShoppingItem, UserProfile } from '../types';

interface AppContextType extends AppState {
  setUser: (user: UserProfile | null) => void;
  createList: (name: string) => string;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => void;
  toggleItem: (listId: string, itemId: string) => void;
  deleteList: (listId: string) => void;
  setActiveList: (listId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'partiu_mercado_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      user: null, // Start with no user to trigger WelcomeScreen
      lists: [],
      activeListId: null,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setUser = useCallback((user: UserProfile | null) => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const createList = useCallback((name: string) => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      items: [],
      status: 'active',
      totalEstimated: 0,
    };
    setState(prev => ({
      ...prev,
      lists: [newList, ...prev.lists],
      activeListId: newList.id
    }));
    return newList.id;
  }, []);

  const addItem = useCallback((listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list => {
        if (list.id === listId) {
          const newItem: ShoppingItem = {
            ...item,
            id: crypto.randomUUID(),
            completed: false
          };
          const updatedItems = [...list.items, newItem];
          return {
            ...list,
            items: updatedItems,
            totalEstimated: updatedItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
          };
        }
        return list;
      })
    }));
  }, []);

  const toggleItem = useCallback((listId: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        }
        return list;
      })
    }));
  }, []);

  const deleteList = useCallback((listId: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== listId),
      activeListId: prev.activeListId === listId ? null : prev.activeListId
    }));
  }, []);

  const setActiveList = useCallback((listId: string) => {
    setState(prev => ({ ...prev, activeListId: listId }));
  }, []);

  return (
    <AppContext.Provider value={{ 
      ...state, 
      setUser, 
      createList, 
      addItem, 
      toggleItem, 
      deleteList, 
      setActiveList 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
