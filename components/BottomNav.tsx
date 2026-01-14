
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "text-primary flex flex-col items-center justify-center w-full h-full gap-1" 
      : "text-slate-400 dark:text-gray-500 hover:text-primary transition-colors flex flex-col items-center justify-center w-full h-full gap-1";
  };

  const getIconClass = (path: string) => {
    const isActive = location.pathname === path;
    return `material-symbols-outlined text-[26px] mb-0.5 ${isActive ? 'filled' : ''}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1c1e22] border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-2 z-50 h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full pb-4 max-w-lg mx-auto">
        <Link to="/home" className={getLinkClass('/home')}>
          <span className={getIconClass('/home')}>home</span>
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        <Link to="/list" className={getLinkClass('/list')}>
          <span className={getIconClass('/list')}>list_alt</span>
          <span className="text-[10px] font-medium">Lista</span>
        </Link>
        <Link to="/history" className={getLinkClass('/history')}>
          <span className={getIconClass('/history')}>history</span>
          <span className="text-[10px] font-medium">Histórico</span>
        </Link>
        <Link to="/profile" className={getLinkClass('/profile')}>
          <span className={getIconClass('/profile')}>person</span>
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
