
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImportScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Simulate processing
      setTimeout(() => {
        setIsUploading(false);
        alert('Lista processada com sucesso!');
        navigate('/list');
      }, 2000);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col max-w-lg mx-auto w-full">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate('/home')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-center flex-1 pr-10">Importar Lista</h1>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-24 gap-6 w-full">
        <div className="relative w-full aspect-[4/5] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-surface-dark transition-all group overflow-hidden">
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-primary">Analisando arquivo...</p>
            </div>
          ) : (
            <>
              <div className="relative mb-8">
                <div className="absolute -left-8 -top-2 rotate-[-15deg] bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-3 z-0">
                  <span className="material-symbols-outlined text-red-500 text-4xl">picture_as_pdf</span>
                </div>
                <div className="relative bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-5 z-10">
                  <span className="material-symbols-outlined text-primary text-5xl">description</span>
                </div>
                <div className="absolute -right-8 -top-2 rotate-[15deg] bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-3 z-0">
                  <span className="material-symbols-outlined text-blue-500 text-4xl">table_view</span>
                </div>
              </div>
              <div className="text-center flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Selecione seu arquivo
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[240px] mx-auto">
                  Suportamos <span className="text-primary font-bold">.csv</span>, <span className="text-primary font-bold">.pdf</span> ou fotos de listas manuscritas.
                </p>
              </div>
            </>
          )}
          <input 
            type="file" 
            accept=".csv, .pdf, image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button className="flex w-full items-center justify-center rounded-2xl h-14 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold shadow-sm">
            <span className="material-symbols-outlined mr-2">folder_open</span>
            Escolher Arquivo
          </button>
          <button onClick={() => navigate('/list')} className="flex w-full items-center justify-center rounded-2xl h-14 bg-primary text-background-dark font-bold shadow-glow">
            Confirmar Importação
          </button>
        </div>
      </main>
    </div>
  );
};

export default ImportScreen;
