
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lists, activeListId, toggleItem } = useApp();
  
  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  
  if (!activeList) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">list_alt</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sua lista está vazia</h2>
        <p className="text-slate-500 mb-6">Comece adicionando itens que você precisa comprar.</p>
        <Link to="/add-item" className="bg-primary px-8 py-3 rounded-xl font-bold text-background-dark shadow-glow">Criar Lista</Link>
      </div>
    );
  }

  const completedCount = activeList.items.filter(i => i.completed).length;
  const categories = Array.from(new Set(activeList.items.map(i => i.category)));

  return (
    <div className="flex flex-col h-screen overflow-hidden max-w-lg mx-auto w-full bg-background-light dark:bg-background-dark">
      <header className="bg-white dark:bg-surface-dark px-6 pt-12 pb-4 shadow-sm z-20 flex-none">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeList.name}
          </h1>
          <div className="flex gap-3">
            <Link to="/add-item" className="text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add</span>
            </Link>
            <button className="text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
            {activeList.items.length} itens
          </span>
          <span>•</span>
          <span>Faltam {activeList.items.length - completedCount} itens</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-background-light dark:bg-background-dark">
        <div className="p-4 space-y-6">
          {categories.map(category => (
            <section key={category}>
              <div className="flex items-center justify-between mb-3 px-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-6 bg-primary rounded-full"></span>
                  {category}
                </h2>
              </div>
              <div className="space-y-3">
                {activeList.items.filter(i => i.category === category).map(item => (
                  <div 
                    key={item.id}
                    className={`group bg-white dark:bg-surface-dark rounded-2xl p-3 shadow-sm flex items-center gap-3 transition-all ${item.completed ? 'opacity-60' : ''}`}
                    onClick={() => toggleItem(activeList.id, item.id)}
                  >
                    <label className="relative flex items-center justify-center h-6 w-6 cursor-pointer">
                      <input 
                        checked={item.completed}
                        onChange={() => {}} // Controlled by parent click
                        className="checkbox-custom appearance-none h-6 w-6 border-2 border-slate-300 rounded-full transition-all focus:ring-0 cursor-pointer" 
                        type="checkbox"
                      />
                    </label>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-slate-800 dark:text-white text-base truncate ${item.completed ? 'line-through decoration-slate-400' : ''}`}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400">{item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 dark:bg-white/10 rounded-lg px-2 py-1 h-8">
                        <span className="font-semibold text-sm text-slate-800 dark:text-white">{item.quantity}</span>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <span className="block font-bold text-slate-900 dark:text-white">R$ {(item.price || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          
          <Link to="/add-item" className="w-full py-4 mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:text-primary hover:border-primary transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
            <span className="font-bold">Adicionar novo item</span>
          </Link>
        </div>
      </main>

      <div className="bg-white dark:bg-surface-dark shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-3xl p-5 z-30 pb-24 fixed bottom-0 left-0 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">No Carrinho</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-slate-800 dark:text-white">R$</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {activeList.items.reduce((acc, i) => i.completed ? acc + (i.price || 0) * i.quantity : acc, 0).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Estimado</p>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-sm font-semibold text-slate-500">R$</span>
              <span className="text-xl font-bold text-slate-500">{activeList.totalEstimated.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            const hasRemaining = activeList.items.some(i => !i.completed);
            if (hasRemaining) navigate('/confirm');
            else navigate('/home');
          }}
          className="w-full bg-primary hover:bg-primary-dark text-slate-900 h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Finalizar Compra</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ListScreen;
