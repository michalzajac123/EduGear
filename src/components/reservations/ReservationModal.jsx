import { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { reservationService } from '../../services/reservationService';
import { Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ReservationModal({ isOpen, onClose, equipment, onSuccess }) {
  const { user } = useAuth();
  const { notify } = useNotification();

  // Today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!equipment) return null;

  const validateDates = () => {
    if (!startDate) return 'Wybierz datę początkową.';
    if (!endDate) return 'Wybierz datę końcową.';
    if (startDate < todayStr) return 'Data początkowa nie może być wcześniejsza niż dzisiaj.';
    if (endDate < startDate) return 'Data końcowa nie może być wcześniejsza niż data początkowa.';
    if (!purpose.trim() || purpose.trim().length < 5) {
      return 'Podaj cel rezerwacji (minimum 5 znaków).';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await reservationService.createReservation({
        equipmentId: equipment.id,
        startDate,
        endDate,
        purpose: purpose.trim()
      });

      notify('Wniosek o rezerwację został pomyślnie wysłany!', 'success');
      setPurpose('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas składania rezerwacji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nowa rezerwacja sprzętu">
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <h4 style={{ margin: 0 }}>{equipment.name}</h4>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Nr seryjny: <strong>{equipment.serialNumber}</strong> &bull; {equipment.location}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Data od:</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              min={todayStr}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate < e.target.value) {
                  setEndDate(e.target.value);
                }
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data do:</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              min={startDate || todayStr}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cel wypożyczenia / zajęcia szkolne</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="np. Przygotowanie materiałów do szkolnej kroniki wideo lub zajęcia koła robotyki"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <span className="form-hint">Opiekun pracowni zapozna się z celem przed zatwierdzeniem wniosku.</span>
        </div>

        <div
          style={{
            background: 'var(--info-bg)',
            border: '1px solid #bae6fd',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            Rezerwujący: <strong>{user?.name}</strong> ({user?.email})
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Anuluj
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Wysyłanie...' : 'Potwierdź rezerwację'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
