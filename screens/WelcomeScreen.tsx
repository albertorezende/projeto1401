
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = isRegistering 
        ? await register(email.trim(), password.trim(), name.trim() || 'Usuário') 
        : await login(email.trim(), password.trim());

      if (result.success) {
        if (isRegistering) {
          alert('Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.');
          setIsRegistering(false);
        }
        // Se for login, o App.tsx redirecionará automaticamente via useEffect de Auth do Context
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000")'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>
      </div>
      
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pt-16 pb-10 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center justify-center mt-6 space-y-4 text-center">
          <div className="flex flex-col items-center mb-2">
            <span className="material-symbols-outlined text-[5rem] text-primary drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">shopping_cart</span>
            <h1 className="font-black text-4xl tracking-tighter text-white uppercase">
              Partiu <span className="text-primary">Mercado</span>
            </h1>
          </div>
          <p className="text-lg font-medium text-white/90">Acesso Global • Sincronizado</p>
        </div>

        <div className="w-full space-y-4">
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-2xl border border-white/20 shadow-2xl">
            <div className="space-y-3">
              {isRegistering && (
                <input 
                  type="text" 
                  placeholder="Seu Nome" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary"
              />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary"
              />
              
              {error && <p className="text-danger text-xs font-bold text-center">{error}</p>}

              <button 
                onClick={handleAction} 
                disabled={loading}
                className="w-full h-14 bg-primary rounded-xl text-background-dark font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : (isRegistering ? 'Criar Conta' : 'Entrar')}
              </button>

              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full py-2 text-white/60 text-xs font-bold uppercase tracking-widest"
              >
                {isRegistering ? 'Já tenho conta' : 'Não tenho conta • Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
