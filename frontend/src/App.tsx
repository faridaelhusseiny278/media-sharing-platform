import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'friends' | 'profile'>('home');

  const handleLogin = (token: string) => {
    login(token);
  };

  const handleRegister = () => {
    setShowLogin(true);
  };

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  const navigateToPage = (page: 'home' | 'friends' | 'profile') => {
    setCurrentPage(page);
  };

  if (isAuthenticated) {
    if (currentPage === 'friends') {
      return <Friends onNavigateHome={() => navigateToPage('home')} onNavigateProfile={() => navigateToPage('profile')} />;
    }
    if (currentPage === 'profile') {
      return <Profile onNavigateHome={() => navigateToPage('home')} onNavigateFriends={() => navigateToPage('friends')} />;
    }
    return <Home onNavigateFriends={() => navigateToPage('friends')} onNavigateProfile={() => navigateToPage('profile')} />;
  }

  return showLogin ? (
    <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
  ) : (
    <Register onRegister={handleRegister} onSwitchToLogin={switchToLogin} />
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
