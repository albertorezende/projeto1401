
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import AddItemScreen from './screens/AddItemScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import EncartesScreen from './screens/EncartesScreen';
import ImportScreen from './screens/ImportScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import BottomNav from './components/BottomNav';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user, isLoading } = useApp();
  
  // Enquanto o Supabase está checando se o usuário está logado
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-white/50 font-bold text-sm tracking-widest uppercase">Sincronizando...</p>
      </div>
    );
  }

  // Se não estiver logado e não estiver na tela de boas-vindas, manda pra lá
  if (!user && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  // Se estiver logado e tentar ir para a tela de boas-vindas, manda para o Início
  if (user && location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  const hideBottomNav = ['/', '/confirm'].includes(location.pathname);

  return (
    <div className="min-h-screen pb-safe">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/list" element={<ListScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/add-item" element={<AddItemScreen />} />
        <Route path="/confirm" element={<ConfirmationScreen />} />
        <Route path="/encartes" element={<EncartesScreen />} />
        <Route path="/import" element={<ImportScreen />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
