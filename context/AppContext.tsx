
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, ShoppingList, ShoppingItem, UserProfile, MockDatabase, UserAccount, UserData } from '../types';

interface AppContextType extends AppState {
  login: (name: string, password: string) => { success: boolean; message: string };
  register: (name: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  createList: (name: string) => string;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => void;
  toggleItem: (listId: string, itemId: string) => void;
  deleteList: (listId: string) => void;
  setActiveList: (listId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DB_KEY = 'partiu_mercado_db_v2';
const SESSION_KEY = 'partiu_mercado_session';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Database and Session initialization
  const [db, setDb] = useState<MockDatabase>(() => {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : { accounts: [], contentStore: {} };
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  });

  // 2. State for the currently logged in user's data
  const [userLists, setUserLists] = useState<ShoppingList[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Persistence of the whole DB
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db]);

  // Persistence of user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      // Load user specific data from DB
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

  // Save active user data back to DB when it changes
  const syncToDb = useCallback(() => {
    if (!currentUser) return;
    setDb(prev => ({
      ...prev,
      contentStore: {
        ...prev.contentStore,
        [currentUser.id]: {
          lists: userLists,
          activeListId: activeId
        }
      }
    }));
  }, [currentUser, userLists, activeId]);

  useEffect(() => {
    const timer = setTimeout(syncToDb, 500); // Debounced sync
    return () => clearTimeout(timer);
  }, [userLists, activeId, syncToDb]);

  // AUTH ACTIONS
  const login = (name: string, password: string) => {
    const account = db.accounts.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (!account) return { success: false, message: 'Usuário não encontrado' };
    if (account.password !== password) return { success: false, message: 'Senha incorreta' };
    
    setCurrentUser({
      id: account.id,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl
    });
    return { success: true, message: 'Sucesso' };
  };

  const register = (name: string, password: string) => {
    const exists = db.accounts.some(a => a.name.toLowerCase() === name.toLowerCase());
    if (exists) return { success: false, message: 'Este nome de usuário já existe' };

    const newId = crypto.randomUUID();
    const newAccount: UserAccount = {
      id: newId,
      name,
      password,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@partiumercado.com`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    setDb(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      contentStore: {
        ...prev.contentStore,
        [newId]: { lists: [], activeListId: null }
      }
    }));

    setCurrentUser({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      avatarUrl: newAccount.avatarUrl
    });

    return { success: true, message: 'Conta criada com sucesso' };
  };

  const logout = () => setCurrentUser(null);

  // DATA ACTIONS (Scoped to userLists state)
  const createList = (name: string) => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      items: [],
      status: 'active',
      totalEstimated: 0,
    };
    setUserLists(prev => [newList, ...prev]);
    setActiveId(newList.id);
    return newList.id;
  };

  const addItem = (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        const newItem: ShoppingItem = { ...item, id: crypto.randomUUID(), completed: false };
        const updatedItems = [...list.items, newItem];
        return {
          ...list,
          items: updatedItems,
          totalEstimated: updatedItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
        };
      }
      return list;
    }));
  };

  const toggleItem = (listId: string, itemId: string) => {
    setUserLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
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
      user: currentUser, 
      lists: userLists, 
      activeListId: activeId,
      login, 
      register, 
      logout,
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
