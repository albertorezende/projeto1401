
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

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
  const { fliers } = useApp();
  const [selectedPdf, setSelectedPdf] = useState<{ name: string, url: string } | null>(null);

  const handleOpenFlier = (marketName: string) => {
    const url = fliers[marketName];
    if (url) {
      setSelectedPdf({ name: marketName, url });
    } else {
      alert(`O encarte do ${marketName} não está disponível no momento.`);
    }
  };

  const closeViewer = () => setSelectedPdf(null);

  return (
    <div className="relative flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-lg mx-auto w-full overflow-hidden">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate('/home')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center text-slate-900 dark:text-white">
          Encartes
        </h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* WELCOME AREA */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Onde vamos <br/><span className="text-primary">economizar hoje?</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Confira as ofertas atuais das principais redes.</p>
        </div>

        {/* GRID DE MERCADOS */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {MARKETS.map((market) => (
            <article 
              key={market.name} 
              className="group flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-primary/10 transition-all duration-300"
            >
              <div className={`relative flex h-20 w-full items-center justify-center rounded-xl ${market.color} p-2 overflow-hidden shadow-inner`}>
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] z-10 text-center">{market.name}</span>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleOpenFlier(market.name)}
                  className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${fliers[market.name] ? 'bg-primary text-background-dark shadow-md active:scale-95' : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {fliers[market.name] ? 'visibility' : 'event_busy'}
                  </span>
                  {fliers[market.name] ? 'Visualizar' : 'Em breve'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center italic">
            Os encartes são atualizados semanalmente.
          </p>
        </div>
      </main>

      {/* VISUALIZADOR DE PDF (MODAL FULLSCREEN) */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[60] bg-black animate-fade-in flex flex-col max-w-lg mx-auto w-full">
          <header className="flex items-center justify-between px-4 py-3 bg-surface-dark text-white border-b border-white/10">
            <button 
              onClick={closeViewer}
              className="size-10 flex items-center justify-center rounded-full bg-white/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">Encarte</p>
              <h3 className="text-sm font-bold">{selectedPdf.name}</h3>
            </div>
            <a 
              href={selectedPdf.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="size-10 flex items-center justify-center rounded-full bg-white/10"
              title="Baixar PDF"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
          </header>
          
          <div className="flex-1 bg-white relative">
            <iframe 
              src={`${selectedPdf.url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none"
              title={`Encarte ${selectedPdf.name}`}
            />
            {/* Overlay invisível para evitar gestos que possam bugar o iframe no mobile se necessário */}
            <div className="absolute top-0 right-0 p-4 pointer-events-none">
                <span className="bg-black/20 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">Leitor Integrado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncartesScreen;
