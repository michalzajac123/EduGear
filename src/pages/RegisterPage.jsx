import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserPlus, User, Mail, Lock, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const { notify } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Imię i nazwisko musi mieć co najmniej 2 znaki.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Podaj adres e-mail.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Podaj poprawny format adresu e-mail.';
    }

    if (!formData.password) {
      newErrors.password = 'Podaj hasło.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne.';
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
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      notify(`Konto utworzone! Witaj w EduGear, ${res.user.name}.`, 'success');
      onNavigate(formData.role === 'caretaker' ? 'caretaker' : 'equipment');
    } catch (err) {
      setServerError(err.message || 'Wystąpił błąd podczas rejestracji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
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
            <UserPlus size={28} />
          </div>
          <h2>Rejestracja w EduGear</h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Dołącz do społeczności szkolnej i korzystaj ze sprzętu pracowni
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
            <label className="form-label">Imię i nazwisko</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                placeholder="np. Michał Zając"
                value={formData.name}
                onChange={handleChange}
              />
              <User
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
              />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Adres e-mail szkolny</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="jan.kowalski@szkola.pl"
                value={formData.email}
                onChange={handleChange}
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
            <label className="form-label">Rola w systemie</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  border: `2px solid ${formData.role === 'student' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: formData.role === 'student' ? 'var(--primary-light)' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <User size={16} color={formData.role === 'student' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Uczeń</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  border: `2px solid ${formData.role === 'caretaker' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: formData.role === 'caretaker' ? 'var(--primary-light)' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="caretaker"
                  checked={formData.role === 'caretaker'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <ShieldCheck size={16} color={formData.role === 'caretaker' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Opiekun pracowni</span>
              </label>
            </div>
            <span className="form-hint">Opiekun posiada uprawnienia do zatwierdzania wniosków i zarządzania sprzętem.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Hasło (min. 6 znaków)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <Lock
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Powtórz hasło</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Lock
                size={16}
                color="var(--text-light)"
                style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
              />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Masz już konto?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
}
