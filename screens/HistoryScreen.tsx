
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lists, setActiveList } = useApp();
  
  const completedLists = lists.filter(l => l.status === 'completed' || l.items.every(i => i.completed));

  return (
    <div className="relative flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-lg mx-auto w-full">
      <header className="flex-none px-6 pt-12 pb-4 bg-white dark:bg-surface-dark shadow-sm z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Histórico
          </h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">filter_list</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar">
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">history</span>
            <p className="font-medium">Nenhum histórico encontrado.</p>
          </div>
        ) : (
          lists.map(list => {
            const date = new Date(list.date);
            const day = date.getDate();
            const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            const progress = list.items.length > 0 
              ? (list.items.filter(i => i.completed).length / list.items.length) * 100 
              : 0;

            return (
              <div 
                key={list.id}
                className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <span className="text-xs font-bold text-gray-400 uppercase">{month}</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{day}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{list.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="material-symbols-outlined text-[16px]">shopping_basket</span>
                        <span>{list.items.length} itens</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setActiveList(list.id);
                    navigate('/list');
                  }}
                  className="w-full h-12 rounded-xl bg-primary/10 text-primary-dark font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                  Ver Detalhes
                </button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default HistoryScreen;
