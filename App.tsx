
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
  const { user } = useApp();
  
  // Routes where bottom nav should be hidden
  const hideBottomNav = ['/', '/confirm'].includes(location.pathname);

  // Simple auth check: if no user and not on welcome, redirect to welcome
  if (!user && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

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
