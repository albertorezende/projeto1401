
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAction = (type: 'login' | 'register') => {
    if (!name.trim()) {
      setError('Digite seu nome');
      return;
    }
    if (!password.trim()) {
      setError('Digite sua senha');
      return;
    }

    const result = type === 'login' 
      ? login(name.trim(), password.trim()) 
      : register(name.trim(), password.trim());

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000")'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90"></div>
      </div>
      
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pt-16 pb-10 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center justify-center mt-6 space-y-4 text-center">
          <div className="flex flex-col items-center mb-2">
            <div className="relative inline-block mb-3">
              <span className="material-symbols-outlined text-[5rem] text-primary drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" style={{fontVariationSettings: "'FILL' 1, 'wght' 600"}}>shopping_cart</span>
              <div className="absolute -top-1 -right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg border-[3px] border-primary transform rotate-12">
                <span className="material-symbols-outlined text-xl text-primary font-bold">attach_money</span>
              </div>
            </div>
            <h1 className="font-black text-4xl tracking-tighter text-white drop-shadow-xl leading-none uppercase">
              Partiu <br/> <span className="text-primary">Mercado</span>
            </h1>
          </div>
          <p className="max-w-[280px] text-lg font-medium text-white/90 drop-shadow-md leading-snug">
            Economize tempo e dinheiro em cada compra
          </p>
        </div>

        <div className="w-full space-y-6">
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Usuário" 
                    className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-all"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Senha" 
                    className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-all"
                  />
                </div>
                {error && (
                  <div className="bg-danger/20 border border-danger/40 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
                    <span className="material-symbols-outlined text-danger text-sm">error</span>
                    <p className="text-white text-xs font-bold">{error}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={() => handleAction('login')} 
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary h-14 text-background-dark shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="z-10 text-base font-bold tracking-wide">Entrar</span>
                  <span className="material-symbols-outlined z-10 ml-2 text-[20px]">login</span>
                </button>
                
                <button 
                  onClick={() => handleAction('register')} 
                  className="flex w-full items-center justify-center rounded-xl border border-white/30 bg-black/20 h-14 text-white backdrop-blur-sm transition-colors hover:bg-black/40 active:bg-black/50"
                >
                  <span className="text-base font-bold tracking-wide">Cadastrar Novo</span>
                  <span className="material-symbols-outlined ml-2 text-[20px]">person_add</span>
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-[11px] text-white/50 px-8 pb-2">
            Desenvolvido para ajudar no seu planejamento doméstico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
