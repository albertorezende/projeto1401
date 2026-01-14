
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark max-w-lg mx-auto">
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000")'}}></div>
        <div className="absolute inset-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-surface-dark shadow-card animate-fade-in">
          <div className="h-2 w-full bg-warning"></div>
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-6 rounded-full bg-amber-50 p-4 dark:bg-warning/10">
              <span className="material-symbols-outlined text-6xl text-warning" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            </div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Atenção!
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                Você ainda tem itens na lista que não foram pegos.
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Deseja finalizar mesmo assim?
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button 
                onClick={() => navigate('/home')} 
                className="group flex w-full items-center justify-center rounded-2xl bg-primary py-4 px-6 text-background-dark shadow-lg shadow-primary/20 font-bold active:scale-[0.98] transition-all"
              >
                <span>Finalizar Compra</span>
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/list')} 
                className="group flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-4 px-6 text-gray-700 font-bold active:scale-[0.98] transition-all dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Voltar para a Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
