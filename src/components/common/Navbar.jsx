import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Package,
  Layers,
  CalendarCheck,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ currentPage, onNavigate }) {
  const { user, isAuthenticated, isCaretaker, logout } = useAuth();
  const { notify } = useNotification();

  const handleLogout = () => {
    logout();
    notify('Zostałeś pomyślnie wylogowany z systemu.', 'info');
    onNavigate('home');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <div
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <Package size={20} />
          </div>
          <span>EduGear</span>
          <span className="navbar-brand-badge">Szkolny Sprzęt</span>
        </a>

        <nav>
          <ul className="navbar-nav">
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => onNavigate('home')}
              >
                Start
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link ${currentPage === 'equipment' ? 'active' : ''}`}
                onClick={() => onNavigate('equipment')}
              >
                <Layers size={16} />
                Katalog sprzętu
              </button>
            </li>

            {isAuthenticated && (
              <li>
                <button
                  type="button"
                  className={`nav-link ${currentPage === 'reservations' ? 'active' : ''}`}
                  onClick={() => onNavigate('reservations')}
                >
                  <CalendarCheck size={16} />
                  Moje rezerwacje
                </button>
              </li>
            )}

            {isAuthenticated && isCaretaker && (
              <li>
                <button
                  type="button"
                  className={`nav-link ${currentPage === 'caretaker' ? 'active' : ''}`}
                  onClick={() => onNavigate('caretaker')}
                >
                  <ShieldCheck size={16} color="var(--primary)" />
                  Panel Opiekuna
                </button>
              </li>
            )}

            {!isAuthenticated ? (
              <>
                <li>
                  <button
                    type="button"
                    className={`btn btn-secondary btn-sm ${currentPage === 'login' ? 'active' : ''}`}
                    onClick={() => onNavigate('login')}
                  >
                    <LogIn size={15} />
                    Logowanie
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`btn btn-primary btn-sm ${currentPage === 'register' ? 'active' : ''}`}
                    onClick={() => onNavigate('register')}
                  >
                    <UserPlus size={15} />
                    Rejestracja
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-user-info">
                <div className="user-avatar-badge">
                  <span className="user-name-text">{user.name}</span>
                  <span
                    className="badge badge-role"
                    style={{ fontSize: '0.6875rem', padding: '0.1rem 0.5rem', alignSelf: 'flex-end' }}
                  >
                    <User size={10} />
                    {isCaretaker ? 'Opiekun' : 'Uczeń'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleLogout}
                  title="Wyloguj się"
                >
                  <LogOut size={15} />
                  Wyloguj
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
