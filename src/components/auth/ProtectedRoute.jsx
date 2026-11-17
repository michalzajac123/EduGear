import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert, LogIn } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole, onNavigate }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p>Ładowanie stanu autoryzacji...</p>
      </div>
    );
  }

  // Security check: Unauthenticated users are strictly blocked
  if (!isAuthenticated) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}
        >
          <Lock size={32} />
        </div>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Dostęp zablokowany</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Ta podstrona jest chroniona. Aby uzyskać do niej dostęp, musisz być zalogowany w systemie EduGear.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate('login')}
          style={{ width: '100%' }}
        >
          <LogIn size={18} />
          Przejdź do logowania
        </button>
      </div>
    );
  }

  // Role authorization check (e.g. Caretaker vs Student)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="card" style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--warning-bg)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Brak wymaganych uprawnień</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Tylko <strong>Opiekun pracowni</strong> posiada dostęp do tego panelu. Twoje obecne konto posiada rolę: <strong>{user?.role}</strong>.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onNavigate('home')}
        >
          Wróć do strony głównej
        </button>
      </div>
    );
  }

  return children;
}
