
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col max-w-lg mx-auto w-full">
      <header className="flex items-center justify-center p-4 pt-12 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <h1 className="text-text-main dark:text-white text-xl font-bold tracking-tight">Perfil</h1>
      </header>

      <main className="flex-1 flex flex-col w-full px-6 pb-24 overflow-y-auto no-scrollbar">
        <div className="mt-4 mb-8 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-soft flex flex-col items-center border border-gray-100 dark:border-gray-800">
          <div className="relative group">
            <div 
              className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 bg-center bg-cover border-4 border-primary/20" 
              style={{ backgroundImage: `url(${user?.avatarUrl})` }}
            ></div>
            <button className="absolute bottom-0 right-0 bg-primary text-background-dark rounded-full p-2 shadow-md">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-text-main dark:text-white">{user?.name}</h2>
          <p className="text-text-sub dark:text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: 'person', label: 'Dados Pessoais' },
            { icon: 'notifications', label: 'Notificações' },
            { icon: 'account_balance_wallet', label: 'Planejamento Mensal' },
            { icon: 'help', label: 'Ajuda & Suporte' },
            { icon: 'settings', label: 'Configurações' },
          ].map(item => (
            <button key={item.label} className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm active:scale-[0.98] transition-transform group">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <span className="text-text-main dark:text-white font-bold">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
            </button>
          ))}
        </div>

        <div className="mt-8 mb-4">
          <button 
            onClick={handleLogout}
            className="w-full py-4 px-4 rounded-xl border border-danger/30 text-danger font-bold hover:bg-danger/5 active:bg-danger/10 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sair da Conta
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
