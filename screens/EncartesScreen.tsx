
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const MARKETS = [
  { name: 'Guanabara', color: 'bg-yellow-500' },
  { name: 'Supermarket', color: 'bg-red-600' },
  { name: 'Mundial', color: 'bg-blue-600' },
  { name: 'Assai', color: 'bg-orange-600' },
  { name: 'Prezunic', color: 'bg-blue-500' },
  { name: 'Rede Economia', color: 'bg-red-700' },
  { name: 'Atacadão', color: 'bg-blue-900' },
  { name: 'Pão de Açúcar', color: 'bg-green-700' }
];

const EncartesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { fliers, refreshFliers } = useApp();
  const [selectedPdf, setSelectedPdf] = useState<{ name: string, url: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (Object.keys(fliers).length === 0) {
      refreshFliers();
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFliers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getFlierUrl = (marketName: string) => {
    // Normaliza para comparação (remove acentos e espaços extras se necessário no futuro)
    const normalizedSearch = marketName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return fliers[normalizedSearch] || fliers[marketName.toLowerCase()];
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview').replace('?usp=sharing', '');
    }
    return url;
  };

  const handleOpenFlier = (marketName: string) => {
    const url = getFlierUrl(marketName);
    if (url) setSelectedPdf({ name: marketName, url });
  };

  return (
    <div className="relative flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-lg mx-auto w-full overflow-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate('/home')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center text-slate-900 dark:text-white">Encartes</h2>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-6 pt-6 pb-2 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Economia na <br/><span className="text-primary">palma da mão</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">Selecione um mercado para ver as ofertas.</p>
        </div>

        {/* GRID DE MERCADOS */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {MARKETS.map((market) => {
            const flierUrl = getFlierUrl(market.name);
            return (
              <article 
                key={market.name} 
                onClick={() => flierUrl && handleOpenFlier(market.name)}
                className={`flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-sm border transition-all duration-300 ${flierUrl ? 'border-transparent hover:border-primary/20 cursor-pointer active:scale-95' : 'border-slate-100 dark:border-white/5 opacity-60'}`}
              >
                <div className={`relative flex h-20 w-full items-center justify-center rounded-xl ${market.color} p-2 shadow-inner overflow-hidden`}>
                  <span className="text-white font-black text-[10px] uppercase tracking-widest z-10 text-center">{market.name}</span>
                  <div className="absolute inset-0 bg-black/10"></div>
                  {flierUrl && (
                    <div className="absolute top-1 right-1">
                      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    disabled={!flierUrl}
                    className={`w-full rounded-lg py-2 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${flierUrl ? 'bg-primary text-background-dark' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{flierUrl ? 'visibility' : 'schedule'}</span>
                    {flierUrl ? 'Ver Ofertas' : 'Indisponível'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {Object.keys(fliers).length === 0 && (
          <div className="mx-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20 text-center mb-4">
            <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest">
              Nenhum encarte carregado. Verifique o Supabase.
            </p>
          </div>
        )}

        <div className="mx-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Atualizado toda semana
          </p>
        </div>
      </main>

      {/* MODAL DO LEITOR INTEGRADO */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[60] bg-black/95 animate-fade-in flex flex-col max-w-lg mx-auto w-full">
          <header className="flex items-center justify-between px-4 py-3 bg-surface-dark text-white border-b border-white/5">
            <button onClick={() => setSelectedPdf(null)} className="size-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Encarte Oficial</p>
              <h3 className="text-sm font-bold">{selectedPdf.name}</h3>
            </div>
            <a 
              href={selectedPdf.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="size-10 flex items-center justify-center rounded-full bg-primary text-background-dark active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </a>
          </header>
          
          <div className="flex-1 bg-white relative overflow-hidden">
            <iframe 
              src={`${getEmbedUrl(selectedPdf.url)}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
              title={`Encarte ${selectedPdf.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EncartesScreen;
