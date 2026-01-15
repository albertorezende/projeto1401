
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lists, activeListId, toggleItem, deleteList, updateItem, deleteItem, setActiveList } = useApp();
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Encontra a lista ativa ou a primeira disponível
  const activeList = lists.find(l => l.id === activeListId) || (lists.length > 0 ? lists[0] : null);
  
  if (!activeList) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-background-light dark:bg-background-dark">
        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-slate-300">list_alt</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sua lista está vazia</h2>
        <p className="text-slate-500 mb-6 text-sm">Crie uma nova lista ou importe um arquivo CSV para começar.</p>
        <Link to="/home" className="bg-primary px-8 py-3 rounded-xl font-bold text-background-dark shadow-glow transition-transform active:scale-95">Ir para o Início</Link>
      </div>
    );
  }

  const handleDeleteList = () => {
    if (window.confirm(`Deseja realmente excluir a lista "${activeList.name}"?`)) {
      const idToDelete = activeList.id;
      deleteList(idToDelete);
      setActiveList(""); // Limpa o ID ativo no estado global
      navigate('/home');
    }
  };

  const handleToggle = (itemId: string, currentPrice: number, completed: boolean) => {
    if (!completed && (!currentPrice || currentPrice <= 0.01)) {
      setErrorToast("Defina o preço antes de marcar como pego!");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }
    toggleItem(activeList.id, itemId);
  };

  const handlePriceChange = (itemId: string, value: string) => {
    const price = parseFloat(value.replace(',', '.')) || 0;
    updateItem(activeList.id, itemId, { price });
  };

  const handleQuickEdit = (itemId: string, updates: any) => {
    updateItem(activeList.id, itemId, updates);
  };

  const completedCount = activeList.items.filter(i => i.completed).length;
  const categories = Array.from(new Set(activeList.items.map(i => i.category)));

  return (
    <div className="flex flex-col h-screen overflow-hidden max-w-lg mx-auto w-full bg-background-light dark:bg-background-dark">
      {/* HEADER */}
      <header className="bg-white dark:bg-surface-dark px-5 pt-10 pb-4 shadow-sm z-20 flex-none border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white truncate pr-4">
            {activeList.name}
          </h1>
          <div className="flex gap-3 items-center">
            <Link to="/add-item" className="text-primary hover:scale-110 transition-transform p-1" title="Adicionar Item">
              <span className="material-symbols-outlined text-[28px] filled">add_circle</span>
            </Link>
            <button 
              onClick={handleDeleteList}
              className="text-slate-300 hover:text-danger transition-colors p-1"
              title="Excluir Lista Toda"
            >
              <span className="material-symbols-outlined text-[24px]">delete_sweep</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="text-primary">{activeList.items.length} itens</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{completedCount} no carrinho</span>
        </div>
      </header>

      {/* TOAST ERRO PREÇO */}
      {errorToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-danger text-white px-4 py-2.5 rounded-xl shadow-xl text-[11px] font-black flex items-center gap-2 animate-fade-in border border-white/20 whitespace-nowrap">
          <span className="material-symbols-outlined text-base">error</span>
          {errorToast}
        </div>
      )}

      {/* LISTA DE ITENS */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-64 bg-background-light dark:bg-background-dark">
        <div className="p-3 space-y-6">
          {categories.map(category => (
            <section key={category}>
              <div className="flex items-center mb-2 px-1">
                <h2 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  {category}
                </h2>
              </div>
              <div className="space-y-2">
                {activeList.items.filter(i => i.category === category).map(item => (
                  <div 
                    key={item.id}
                    className={`bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all ${item.completed ? 'opacity-40' : 'border border-transparent hover:border-primary/10'}`}
                  >
                    {/* CHECKBOX REDUZIDO (h-6) */}
                    <button 
                      onClick={() => handleToggle(item.id, item.price || 0, item.completed)}
                      className="relative flex items-center justify-center h-6 w-6 flex-shrink-0"
                    >
                      <input 
                        readOnly
                        checked={item.completed}
                        className="checkbox-custom appearance-none h-6 w-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg transition-all focus:ring-0 cursor-pointer pointer-events-none" 
                        type="checkbox"
                      />
                    </button>
                    
                    {/* INFO ITEM */}
                    <div className="flex-1 min-w-0">
                      {editingItemId === item.id ? (
                        <div className="flex flex-col gap-1.5 animate-fade-in">
                          <input 
                            autoFocus
                            className="text-xs font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 w-full focus:ring-1 focus:ring-primary outline-none"
                            defaultValue={item.name}
                            onBlur={(e) => {
                              handleQuickEdit(item.id, { name: e.target.value });
                              setEditingItemId(null);
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              className="w-14 text-[10px] font-black bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5"
                              defaultValue={item.quantity}
                              onChange={(e) => handleQuickEdit(item.id, { quantity: parseInt(e.target.value) || 1 })}
                            />
                            <input 
                              className="w-14 text-[10px] font-black bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1.5 py-0.5 uppercase"
                              defaultValue={item.unit}
                              onChange={(e) => handleQuickEdit(item.id, { unit: e.target.value })}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className={`font-bold text-slate-800 dark:text-white text-sm truncate leading-tight ${item.completed ? 'line-through decoration-slate-400' : ''}`}>
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-black text-primary uppercase">{item.quantity} {item.unit}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* PREÇO EDITÁVEL */}
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-18 group">
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 group-focus-within:text-primary transition-colors">R$</span>
                        <input 
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          defaultValue={item.price || ""}
                          onBlur={(e) => handlePriceChange(item.id, e.target.value)}
                          className="w-[72px] pl-6 pr-1.5 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg text-[11px] font-black text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:bg-white outline-none text-right transition-all cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className={`p-1 transition-colors ${editingItemId === item.id ? 'text-primary' : 'text-slate-300 hover:text-slate-500'}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteItem(activeList.id, item.id)}
                          className="text-slate-200 hover:text-danger transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          
          <Link to="/add-item" className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-300 dark:text-slate-600 hover:text-primary hover:border-primary transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="font-black text-[10px] uppercase tracking-widest">Novo Item</span>
          </Link>
        </div>
      </main>

      {/* RESUMO FINANCEIRO */}
      <div className="bg-white dark:bg-surface-dark shadow-[0_-15px_50px_rgba(0,0,0,0.12)] rounded-t-[32px] p-5 z-30 pb-32 fixed bottom-0 left-0 w-full max-w-lg mx-auto border-t border-slate-50 dark:border-white/5">
        <div className="flex justify-between items-end mb-5 px-1">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">No Carrinho</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-primary">R$</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {activeList.items.reduce((acc, i) => i.completed ? acc + (i.price || 0) * i.quantity : acc, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Previsto</p>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-[10px] font-bold text-slate-400">R$</span>
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400">
                {activeList.totalEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            const hasRemaining = activeList.items.some(i => !i.completed);
            if (hasRemaining) navigate('/confirm');
            else navigate('/home');
          }}
          className="w-full bg-primary hover:bg-primary-dark text-background-dark h-14 rounded-2xl font-black text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.97] uppercase tracking-wider"
        >
          <span>Finalizar Compra</span>
          <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
        </button>
      </div>
    </div>
  );
};

export default ListScreen;
