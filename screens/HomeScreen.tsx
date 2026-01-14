
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const HomeScreen: React.FC = () => {
  const { user, createList } = useApp();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden antialiased pb-24">
      <div className="fixed top-0 right-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3 z-0"></div>
      
      <div className="relative z-10 flex flex-col px-6 max-w-lg mx-auto w-full">
        <header className="flex flex-col gap-2 pt-8 pb-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              <span className="text-sm font-bold tracking-widest text-primary uppercase">Partiu Mercado</span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-slate-600 dark:text-white text-[20px]">notifications</span>
            </button>
          </div>
        </header>

        <div className="py-4 mb-2">
          <h1 className="text-[#101b0e] dark:text-white tracking-tight text-[36px] font-extrabold leading-[1.1] text-left">
            Olá, {user?.name.split(' ')[0]}!<br/>
            <span className="text-primary relative inline-block">
              O que comprar?
              <svg className="absolute w-full h-3 bottom-1 left-0 translate-y-full text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
              </svg>
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-5 mt-6">
          <button 
            onClick={() => createList('Minha Lista')}
            className="group relative w-full text-left"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-green-400 rounded-[26px] opacity-30 group-hover:opacity-60 blur-sm transition duration-300"></div>
            <Link to="/add-item" className="relative flex items-stretch justify-between gap-4 rounded-3xl bg-white dark:bg-[#252a33] p-6 shadow-glow dark:shadow-none hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col justify-center gap-2 flex-[2]">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight">Criar Nova Lista</p>
                  <p className="text-primary text-sm font-semibold leading-normal mt-1">Adicione itens do zero</p>
                </div>
              </div>
              <div className="w-28 rounded-2xl bg-center bg-no-repeat bg-cover flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300" alt="Grocery" className="w-full h-full object-cover" />
              </div>
            </Link>
          </button>

          <Link to="/import" className="group relative w-full text-left">
            <div className="flex items-stretch justify-between gap-4 rounded-3xl bg-white dark:bg-white/5 p-5 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent dark:border-white/10">
              <div className="flex flex-col justify-center gap-2 flex-[1.5]">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-1">
                  <span className="material-symbols-outlined">cloud_download</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Importar Lista</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal mt-1">CSV, PDF ou Foto</p>
                </div>
              </div>
              <div className="w-24 rounded-2xl bg-blue-100/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-blue-400">description</span>
              </div>
            </div>
          </Link>

          <Link to="/encartes" className="group relative w-full text-left">
            <div className="flex items-stretch justify-between gap-4 rounded-3xl bg-white dark:bg-white/5 p-5 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent dark:border-white/10">
              <div className="flex flex-col justify-center gap-2 flex-[1.5]">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-1">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Encartes</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal mt-1">Ofertas atualizadas</p>
                </div>
              </div>
              <div className="w-24 rounded-2xl bg-orange-100/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 text-orange-400/80">
                <span className="material-symbols-outlined text-4xl">campaign</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
