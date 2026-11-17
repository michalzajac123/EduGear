import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotificationToast from './components/common/NotificationToast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import EquipmentPage from './pages/EquipmentPage';
import MyReservationsPage from './pages/MyReservationsPage';
import CaretakerPage from './pages/CaretakerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/main.css';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle browser back/forward or hash change if used
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'equipment', 'reservations', 'caretaker', 'login', 'register'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'equipment':
        return <EquipmentPage onNavigate={navigateTo} />;
      case 'reservations':
        return (
          <ProtectedRoute onNavigate={navigateTo}>
            <MyReservationsPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'caretaker':
        return (
          <ProtectedRoute requiredRole="caretaker" onNavigate={navigateTo}>
            <CaretakerPage onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <Footer />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </NotificationProvider>
  );
}
