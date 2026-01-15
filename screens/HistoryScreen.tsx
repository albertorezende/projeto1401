
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingList } from '../types';

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lists, createList, addItem, setActiveList } = useApp();
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  
  const handleReuseList = (list: ShoppingList) => {
    // 1. Criar uma nova lista baseada na histórica
    const newId = createList(list.name + " (Cópia)");
    
    // 2. Adicionar todos os itens da lista histórica como "não concluídos"
    list.items.forEach(item => {
      addItem(newId, {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        price: item.price
      });
    });

    // 3. Definir como ativa e navegar para a tela de lista
    setActiveList(newId);
    navigate('/list');
  };

  const toggleDetails = (id: string) => {
    setExpandedListId(expandedListId === id ? null : id);
  };

  return (
    <div className="relative flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-lg mx-auto w-full">
      <header className="flex-none px-6 pt-12 pb-4 bg-white dark:bg-surface-dark shadow-sm z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Histórico
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 text-slate-400">
            <span className="material-symbols-outlined text-[24px]">history_toggle_off</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 no-scrollbar">
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center opacity-40">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl">folder_off</span>
            </div>
            <p className="font-bold text-sm">Nenhuma lista no histórico.</p>
          </div>
        ) : (
          lists.map(list => {
            const date = new Date(list.date);
            const day = date.getDate();
            const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            const isExpanded = expandedListId === list.id;
            
            const purchasedItems = list.items.filter(i => i.completed);
            const pendingItems = list.items.filter(i => !i.completed);
            const progress = list.items.length > 0 ? (purchasedItems.length / list.items.length) * 100 : 0;

            return (
              <div 
                key={list.id}
                className={`bg-white dark:bg-surface-dark rounded-3xl shadow-sm border transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20 border-primary/30' : 'border-slate-100 dark:border-white/5'}`}
              >
                {/* CARD PRINCIPAL */}
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 shrink-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{month}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{list.name}</h3>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                          {list.items.length} Itens
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-primary">{Math.round(progress)}% Concluído</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleDetails(list.id)}
                      className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isExpanded ? 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' : 'bg-primary/10 text-primary-dark dark:text-primary hover:bg-primary/20'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isExpanded ? 'expand_less' : 'visibility'}
                      </span>
                      {isExpanded ? 'Fechar' : 'Ver Detalhes'}
                    </button>
                    
                    <button 
                      onClick={() => handleReuseList(list)}
                      className="h-12 px-4 rounded-xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">rebase_edit</span>
                      Reutilizar
                    </button>
                  </div>
                </div>

                {/* DETALHES EXPANDIDOS */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 space-y-6 animate-fade-in border-t border-slate-50 dark:border-white/5">
                    {/* NÃO COMPRADOS */}
                    {pendingItems.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-black text-danger uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-danger rounded-full"></span>
                          Faltou Comprar ({pendingItems.length})
                        </h4>
                        <div className="space-y-2">
                          {pendingItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">{item.quantity} {item.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COMPRADOS */}
                    {purchasedItems.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Comprado ({purchasedItems.length})
                        </h4>
                        <div className="space-y-2">
                          {purchasedItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 line-through">{item.name}</span>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase">{item.quantity} {item.unit}</p>
                                <p className="text-[9px] font-bold text-green-600 dark:text-green-400">R$ {item.price?.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {list.items.length === 0 && (
                      <p className="text-center text-xs text-slate-400 font-bold italic py-4">Lista vazia.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default HistoryScreen;
