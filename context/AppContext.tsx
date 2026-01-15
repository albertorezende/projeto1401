
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ShoppingList, ShoppingItem, UserProfile, MockDatabase, UserAccount, UserData } from '../types';

interface AppContextType extends AppState {
  login: (name: string, password: string) => { success: boolean; message: string };
  register: (name: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  createList: (name: string) => string;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItem: (listId: string, itemId: string) => void;
  deleteList: (listId: string) => void;
  setActiveList: (listId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DB_KEY = 'partiu_mercado_db_v2';
const SESSION_KEY = 'partiu_mercado_session';

// Links permanentes e fixos da estrutura do App
const DEFAULT_FLIERS = {
  'Guanabara': 'https://drive.google.com/file/d/1PA656QzkpWnp-ZjWxO2lTLkvcBn07r5B/view?usp=drive_link',
  'Supermarket': 'https://drive.google.com/file/d/1FS7B0srC3doVbcbBux0Cgx5nhV1bnqz5/view?usp=drive_link',
  'Mundial': 'https://drive.google.com/file/d/1vJsLY5vyTgysaZrb6lYnG21CRbEA_L84/view?usp=drive_link',
  'Assaí': 'https://drive.google.com/file/d/1ugeajFBQBtwRRYf3lop7lPMcSKo2OldJ/view?usp=drive_link'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<MockDatabase>(() => {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : { accounts: [], contentStore: {} };
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  });

  const [userLists, setUserLists] = useState<ShoppingList[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Encartes agora são estáticos baseados na configuração do app
  const [fliers] = useState<Record<string, string>>(DEFAULT_FLIERS);

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      const userData = db.contentStore[currentUser.id];
      if (userData) {
        setUserLists(userData.lists || []);
        setActiveId(userData.activeListId || null);
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
      setUserLists([]);
      setActiveId(null);
    }
  }, [currentUser, db.contentStore]);

  const syncToDb = useCallback(() => {
    if (!currentUser) return;
    setDb(prev => ({
      ...prev,
      contentStore: {
        ...prev.contentStore,
        [currentUser.id]: {
          lists: userLists,
          activeListId: activeId,
          fliers: fliers 
        }
      }
    }));
  }, [currentUser, userLists, activeId, fliers]);

  useEffect(() => {
    const timer = setTimeout(syncToDb, 500);
    return () => clearTimeout(timer);
  }, [userLists, activeId, syncToDb]);

  const login = (name: string, password: string) => {
    const account = db.accounts.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (!account) return { success: false, message: 'Usuário não encontrado' };
    if (account.password !== password) return { success: false, message: 'Senha incorreta' };
    setCurrentUser({ id: account.id, name: account.name, email: account.email, avatarUrl: account.avatarUrl });
    return { success: true, message: 'Sucesso' };
  };

  const register = (name: string, password: string) => {
    const exists = db.accounts.some(a => a.name.toLowerCase() === name.toLowerCase());
    if (exists) return { success: false, message: 'Este nome de usuário já existe' };
    const newId = crypto.randomUUID();
    const newAccount: UserAccount = {
      id: newId, name, password,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@partiumercado.com`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    setDb(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      contentStore: { ...prev.contentStore, [newId]: { lists: [], activeListId: null, fliers: {} } }
    }));
    setCurrentUser({ id: newAccount.id, name: newAccount.name, email: newAccount.email, avatarUrl: newAccount.avatarUrl });
    return { success: true, message: 'Conta criada com sucesso' };
  };

  const logout = () => setCurrentUser(null);

  const createList = (name: string) => {
    const newList: ShoppingList = { id: crypto.randomUUID(), name, date: new Date().toISOString(), items: [], status: 'active', totalEstimated: 0 };
    setUserLists(prev => [newList, ...prev]);
    setActiveId(newList.id);
    return newList.id;
  };

  const addItem = (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        const newItem: ShoppingItem = { ...item, id: crypto.randomUUID(), completed: false };
        const updatedItems = [...list.items, newItem];
        return { ...list, items: updatedItems, totalEstimated: updatedItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0) };
      }
      return list;
    }));
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item => item.id === itemId ? { ...item, ...updates } : item);
        return { ...list, items: updatedItems, totalEstimated: updatedItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0) };
      }
      return list;
    }));
  };

  const deleteItem = (listId: string, itemId: string) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.filter(item => item.id !== itemId);
        return { ...list, items: updatedItems, totalEstimated: updatedItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0) };
      }
      return list;
    }));
  };

  const toggleItem = (listId: string, itemId: string) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, items: list.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item) };
      }
      return list;
    }));
  };

  const deleteList = (listId: string) => {
    setUserLists(prev => prev.filter(l => l.id !== listId));
    if (activeId === listId) setActiveId(null);
  };

  const setActiveList = (listId: string) => setActiveId(listId);

  return (
    <AppContext.Provider value={{ 
      user: currentUser, lists: userLists, activeListId: activeId, fliers,
      login, register, logout, createList, addItem, updateItem, deleteItem, toggleItem, deleteList, setActiveList
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
