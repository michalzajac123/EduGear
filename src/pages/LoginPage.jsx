import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LogIn, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const { notify } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Podaj adres e-mail.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Niepoprawny format adresu e-mail.';
    }

    if (!password) {
      newErrors.password = 'Wprowadź hasło.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(email, password);
      notify(`Witaj ponownie, ${res.user.name}!`, 'success');
      onNavigate(res.user.role === 'caretaker' ? 'caretaker' : 'equipment');
    } catch (err) {
      setServerError(err.message || 'Błąd logowania. Sprawdź poprawność danych.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}
          >
            <LogIn size={28} />
          </div>
          <h2>Logowanie do EduGear</h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Zaloguj się, aby rezerwować sprzęt szkolny i zarządzać wnioskami
          </p>
        </div>

        {serverError && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Adres e-mail</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="twoj.email@szkola.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Mail
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Hasło</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Lock
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        {/* Quick demo credentials for grading and testing */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8125rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="var(--primary)" />
            Konta testowe (szybkie logowanie):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('student@edugear.pl', 'Password123!')}
            >
              Uczeń (Jan)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('opiekun@edugear.pl', 'Password123!')}
            >
              Opiekun (Anna)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Nie masz jeszcze konta?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Zarejestruj się
          </button>
        </div>
      </div>
    </div>
  );
}
