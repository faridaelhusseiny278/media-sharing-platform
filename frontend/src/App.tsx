import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

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

  if (isAuthenticated) {
    return <Home />;
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
