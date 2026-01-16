
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState, ShoppingList, ShoppingItem, UserProfile } from '../types';

/**
 * CONFIGURAÇÃO DO BACKEND (SUPABASE)
 * 1. Vá em Settings > API no seu painel do Supabase.
 * 2. Copie a "Project URL" e cole entre as aspas de SUPABASE_URL.
 * 3. Copie a "anon public" key e cole entre as aspas de SUPABASE_ANON_KEY.
 */
const SUPABASE_URL = 'https://nqhewhthzeoolqqnpwic.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaGV3aHRoemVvb2xxcW5wd2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzUwMTksImV4cCI6MjA4NDE1MTAxOX0.jHk4jAKBRQFOgRHzV7d1eKbJzEUU4yCgH1AIapTP02Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AppContextType extends AppState {
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, pass: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  createList: (name: string) => Promise<string | null>;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => Promise<void>;
  deleteItem: (listId: string, itemId: string) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  setActiveList: (listId: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [fliers, setFliers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais (Sessão e Encartes)
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        
        // Verifica se já existe um usuário logado no navegador
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Usuário',
            email: session.user.email || '',
            avatarUrl: session.user.user_metadata.avatar_url
          });
          await fetchUserLists(session.user.id);
        }

        // Busca os encartes que você cadastrou na tabela 'fliers' do Supabase
        const { data: flierData } = await supabase.from('fliers').select('market_name, url');
        if (flierData) {
          const flierMap = flierData.reduce((acc, curr) => ({ ...acc, [curr.market_name]: curr.url }), {});
          setFliers(flierMap);
        }
      } catch (error) {
        console.error("Erro ao inicializar app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    // Fica ouvindo se o usuário deslogar ou logar em outra aba
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'Usuário',
          email: session.user.email || '',
          avatarUrl: session.user.user_metadata.avatar_url
        });
        await fetchUserLists(session.user.id);
      } else {
        setUser(null);
        setLists([]);
        setActiveListId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserLists = async (userId: string) => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*, items:shopping_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formattedLists: ShoppingList[] = data.map(l => ({
        id: l.id,
        name: l.name,
        date: l.created_at,
        status: l.status,
        totalEstimated: l.items.reduce((acc: number, i: any) => acc + (i.price || 0) * i.quantity, 0),
        items: l.items
      }));
      setLists(formattedLists);
      if (formattedLists.length > 0 && !activeListId) setActiveListId(formattedLists[0].id);
    }
  };

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { success: false, message: error.message };
    if (data.user) await fetchUserLists(data.user.id);
    return { success: true, message: 'Sucesso' };
  };

  const register = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { 
        data: { 
          full_name: name, 
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}` 
        } 
      }
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar.' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const createList = async (name: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) return null;
    const newList: ShoppingList = { id: data.id, name: data.name, date: data.created_at, items: [], status: 'active', totalEstimated: 0 };
    setLists(prev => [newList, ...prev]);
    setActiveListId(data.id);
    return data.id;
  };

  const addItem = async (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{ ...item, list_id: listId, completed: false }])
      .select()
      .single();

    if (!error && data) {
      setLists(prev => prev.map(l => 
        l.id === listId 
          ? { 
              ...l, 
              items: [...l.items, data], 
              totalEstimated: l.totalEstimated + (data.price * data.quantity) 
            } 
          : l
      ));
    }
  };

  const updateItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const { error } = await supabase.from('shopping_items').update(updates).eq('id', itemId);
    if (!error) {
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          const newItems = l.items.map(i => i.id === itemId ? { ...i, ...updates } : i);
          return { 
            ...l, 
            items: newItems, 
            totalEstimated: newItems.reduce((acc, curr) => acc + (curr.price || 0) * curr.quantity, 0) 
          };
        }
        return l;
      }));
    }
  };

  const deleteItem = async (listId: string, itemId: string) => {
    const { error } = await supabase.from('shopping_items').delete().eq('id', itemId);
    if (!error) {
      setLists(prev => prev.map(l => 
        l.id === listId 
          ? { ...l, items: l.items.filter(i => i.id !== itemId) } 
          : l
      ));
    }
  };

  const toggleItem = async (listId: string, itemId: string) => {
    const item = lists.find(l => l.id === listId)?.items.find(i => i.id === itemId);
    if (item) {
      await updateItem(listId, itemId, { completed: !item.completed });
    }
  };

  const deleteList = async (listId: string) => {
    const { error } = await supabase.from('shopping_lists').delete().eq('id', listId);
    if (!error) {
      setLists(prev => prev.filter(l => l.id !== listId));
      if (activeListId === listId) setActiveListId(null);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, lists, activeListId, fliers, isLoading,
      login, register, logout, createList, addItem, updateItem, deleteItem, toggleItem, deleteList, setActiveList: setActiveListId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};
