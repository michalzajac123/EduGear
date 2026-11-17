import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { reservationService } from '../services/reservationService';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function MyReservationsPage({ onNavigate }) {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reservationService.getReservations();
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      setError(err.message || 'Nie udało się pobrać rezerwacji.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancel = async (id) => {
    if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację sprzętu?')) {
      return;
    }

    try {
      setCancellingId(id);
      await reservationService.cancelReservation(id);
      notify('Rezerwacja została anulowana.', 'info');
      fetchReservations();
    } catch (err) {
      notify(err.message || 'Błąd podczas anulowania rezerwacji.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending"><Clock size={12} /> Oczekuje na zatwierdzenie</span>;
      case 'approved':
        return <span className="badge badge-approved"><CheckCircle size={12} /> Zatwierdzona przez opiekuna</span>;
      case 'rejected':
        return <span className="badge badge-rejected"><XCircle size={12} /> Odrzucona</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled"><XCircle size={12} /> Anulowana przez ucznia</span>;
      case 'returned':
        return <span className="badge badge-returned"><RotateCcw size={12} /> Zwrócona do pracowni</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Moje Rezerwacje</h2>
          <p>Podgląd Twoich wniosków, statusów wydania oraz możliwość odwołania rezerwacji</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate('equipment')}
        >
          <Calendar size={16} />
          Nowa rezerwacja sprzętu
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>Ładowanie rezerwacji...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <CalendarCheck size={28} />
          </div>
          <h3>Brak aktywnych rezerwacji</h3>
          <p style={{ maxWidth: '420px', margin: '0.5rem auto 1.5rem auto' }}>
            Nie złożyłeś jeszcze żadnej rezerwacji na sprzęt szkolny. Przejdź do katalogu i wybierz potrzebny sprzęt.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('equipment')}
          >
            Przejdź do katalogu sprzętu
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservations.map((res) => {
            const canCancel = res.status === 'pending' || res.status === 'approved';

            return (
              <div key={res.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                      ID Rezerwacji: #{res.id}
                    </span>
                    <h3 style={{ marginTop: '0.25rem', fontSize: '1.25rem' }}>{res.equipmentName}</h3>
                  </div>
                  <div>
                    {getStatusBadge(res.status)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Termin wypożyczenia:</span>
                    <strong>{res.startDate} &rarr; {res.endDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Data złożenia wniosku:</span>
                    <span>{new Date(res.createdAt).toLocaleDateString('pl-PL')} {new Date(res.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cel rezerwacji: </span>
                  <span>{res.purpose}</span>
                </div>

                {res.caretakerNotes && (
                  <div
                    style={{
                      background: 'var(--info-bg)',
                      border: '1px solid #bae6fd',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.8125rem',
                      color: '#0369a1',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <MessageSquare size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Uwagi opiekuna:</strong> {res.caretakerNotes}
                    </div>
                  </div>
                )}

                {canCancel && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(res.id)}
                      disabled={cancellingId === res.id}
                    >
                      {cancellingId === res.id ? 'Anulowanie...' : 'Odwołaj rezerwację'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
