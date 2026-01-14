
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['Hortifruti', 'Limpeza', 'Padaria', 'Açougue', 'Bebidas', 'Laticínios', 'Outros'];
const UNITS = ['uni', 'kg', 'g', 'L', 'ml', 'cx', 'pct'];

const AddItemScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, activeListId, lists } = useApp();
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('uni');
  const [category, setCategory] = useState('Hortifruti');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const listId = activeListId || (lists.length > 0 ? lists[0].id : null);
    if (!listId) return;

    addItem(listId, {
      name,
      quantity,
      unit,
      category,
      price: price ? parseFloat(price) : 0
    });

    navigate('/list');
  };

  const addAndKeep = () => {
    if (!name.trim()) return;
    const listId = activeListId || (lists.length > 0 ? lists[0].id : null);
    if (!listId) return;

    addItem(listId, {
      name,
      quantity,
      unit,
      category,
      price: price ? parseFloat(price) : 0
    });
    
    setName('');
    setQuantity(1);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark antialiased pb-24 max-w-lg mx-auto w-full">
      <div className="relative z-10 flex flex-col px-6">
        <header className="flex flex-col gap-2 pt-8 pb-4">
          <div className="flex items-center justify-between h-12">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="text-sm font-bold tracking-widest text-primary uppercase">Partiu Mercado</span>
            <div className="w-10"></div>
          </div>
        </header>

        <div className="py-2 mb-2">
          <h1 className="text-[#101b0e] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight">
            Adicionar<br/>
            <span className="text-primary">Novo Item</span>
          </h1>
        </div>

        <form className="flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Nome do produto</label>
            <input 
              className="w-full bg-white dark:bg-[#252a33] border-none rounded-2xl px-6 py-4 text-xl font-semibold text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary" 
              placeholder="Ex: Leite Desnatado" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quantidade</label>
              <div className="bg-white dark:bg-[#252a33] rounded-2xl p-1 shadow-sm flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-400"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-primary"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Unidade</label>
              <select 
                className="w-full bg-white dark:bg-[#252a33] border-none rounded-2xl px-4 py-3 h-[56px] text-lg font-medium text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary appearance-none"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Preço Unitário (Opcional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
              <input 
                type="number"
                step="0.01"
                className="w-full bg-white dark:bg-[#252a33] border-none rounded-2xl pl-12 pr-6 py-4 text-xl font-semibold text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary" 
                placeholder="0,00" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    category === cat 
                      ? 'bg-primary text-background-dark scale-105 shadow-md' 
                      : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button 
              type="button" 
              onClick={addAndKeep}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#252a33] border border-slate-200 dark:border-slate-700 px-4 py-4 text-slate-600 dark:text-slate-300 font-bold active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="text-sm">Mais um</span>
            </button>
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-background-dark shadow-glow font-bold active:scale-[0.98] transition-all"
            >
              <span className="text-sm">Finalizar</span>
              <span className="material-symbols-outlined text-[20px]">check</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemScreen;
