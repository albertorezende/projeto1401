
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MARKETS = [
  { name: 'Guanabara', color: 'bg-yellow-500' },
  { name: 'Supermarket', color: 'bg-red-600' },
  { name: 'Mundial', color: 'bg-blue-600' },
  { name: 'Assaí', color: 'bg-orange-600' },
  { name: 'Carrefour', color: 'bg-blue-800' },
  { name: 'Pão de Açúcar', color: 'bg-green-700' }
];

const EncartesScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-lg mx-auto w-full">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate('/home')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">
          Encartes de Mercados
        </h2>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-[#101b0e] dark:text-white leading-tight">
            Onde vamos <br/><span className="text-primary">economizar hoje?</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Selecione uma rede para ver as ofertas.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          {MARKETS.map((market) => (
            <article key={market.name} className="group flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-primary/20 transition-all">
              <div className={`relative flex h-24 w-full items-center justify-center rounded-xl ${market.color} p-2 overflow-hidden`}>
                <span className="text-white font-black text-xs uppercase tracking-widest">{market.name}</span>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-center text-gray-900 dark:text-gray-100">{market.name}</h4>
                <button className="w-full rounded-lg bg-primary/10 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark">
                  Ver Encarte
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EncartesScreen;
