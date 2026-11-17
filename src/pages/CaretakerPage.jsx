import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { reservationService } from '../services/reservationService';
import { equipmentService } from '../services/equipmentService';
import Modal from '../components/common/Modal';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Plus,
  Package,
  Layers,
  MessageSquare,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react';

export default function CaretakerPage() {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'equipment'
  const [reservations, setReservations] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Note modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState(null);
  const [targetStatus, setTargetStatus] = useState(null);
  const [caretakerNote, setCaretakerNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New equipment modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: 'Kamery i aparaty',
    description: '',
    serialNumber: '',
    location: 'Pracownia Multimedialna 104',
    imageUrl: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [resData, eqData] = await Promise.all([
        reservationService.getReservations(),
        equipmentService.getAllEquipment()
      ]);
      if (resData.success) setReservations(resData.data);
      if (eqData.success) setEquipmentList(eqData.data);
    } catch (err) {
      setError(err.message || 'Błąd podczas ładowania danych panelu opiekuna.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenStatusModal = (id, status) => {
    setSelectedResId(id);
    setTargetStatus(status);
    setCaretakerNote('');
    setIsNoteModalOpen(true);
  };

  const handleConfirmStatus = async () => {
    if (!selectedResId || !targetStatus) return;

    setActionLoading(true);
    try {
      await reservationService.updateReservationStatus(selectedResId, targetStatus, caretakerNote);
      notify(`Status rezerwacji został zmieniony na: ${targetStatus}.`, 'success');
      setIsNoteModalOpen(false);
      loadData();
    } catch (err) {
      notify(err.message || 'Błąd podczas aktualizacji statusu.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newEquipment.name.trim() || !newEquipment.serialNumber.trim()) {
      setAddError('Nazwa sprzętu i numer seryjny są wymagane.');
      return;
    }

    setAddLoading(true);
    try {
      await equipmentService.addEquipment(newEquipment);
      notify('Nowy sprzęt został dodany do bazy pracowni!', 'success');
      setIsAddModalOpen(false);
      setNewEquipment({
        name: '',
        category: 'Kamery i aparaty',
        description: '',
        serialNumber: '',
        location: 'Pracownia Multimedialna 104',
        imageUrl: ''
      });
      loadData();
    } catch (err) {
      setAddError(err.message || 'Błąd podczas dodawania sprzętu.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleMaintenance = async (item) => {
    const newStatus = item.status === 'maintenance' ? 'available' : 'maintenance';
    try {
      await equipmentService.updateEquipment(item.id, { status: newStatus });
      notify(`Zaktualizowano status sprzętu: ${item.name}`, 'info');
      loadData();
    } catch (err) {
      notify(err.message || 'Błąd aktualizacji statusu.', 'error');
    }
  };

  // Metrics
  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const approvedCount = reservations.filter(r => r.status === 'approved').length;
  const totalEquipmentCount = equipmentList.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-role">
              <ShieldCheck size={13} />
              Opiekun pracowni
            </span>
          </div>
          <h2>Panel Opiekuna Pracowni</h2>
          <p>Zatwierdzanie wydania sprzętu, obsługa wniosków uczniów i stan inwentarza</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            Dodaj nowy sprzęt
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Oczekujące wnioski</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Zatwierdzone / Wydane</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem' }}>
            {approvedCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Sprzęt w ewidencji</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {totalEquipmentCount}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('reservations')}
        >
          <Clock size={15} />
          Wnioski rezerwacyjne ({reservations.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'equipment' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('equipment')}
        >
          <Package size={15} />
          Zarządzanie inwentarzem ({equipmentList.length})
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>Ładowanie danych panelu...</p>
        </div>
      ) : activeTab === 'reservations' ? (
        /* Reservations View */
        reservations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>Brak zgłoszonych rezerwacji w systemie.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reservations.map((res) => (
              <div key={res.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>#{res.id}</span>
                      <span className={`badge badge-${res.status}`}>{res.status}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{res.equipmentName}</h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      <User size={15} color="var(--primary)" />
                      <span>{res.userName}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.userEmail}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Termin:</span>
                    <strong>{res.startDate} &rarr; {res.endDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Wysłano:</span>
                    <span>{new Date(res.createdAt).toLocaleDateString('pl-PL')} {new Date(res.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Uzasadnienie ucznia: </span>
                  <span>{res.purpose}</span>
                </div>

                {res.caretakerNotes && (
                  <div style={{ background: '#f0f9ff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: '#0369a1', marginBottom: '1rem' }}>
                    <strong>Notatka dla ucznia:</strong> {res.caretakerNotes}
                  </div>
                )}

                {/* Caretaker actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  {res.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenStatusModal(res.id, 'rejected')}
                      >
                        <XCircle size={15} />
                        Odrzuć wniosek
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleOpenStatusModal(res.id, 'approved')}
                      >
                        <CheckCircle size={15} />
                        Zatwierdź wydanie
                      </button>
                    </>
                  )}

                  {res.status === 'approved' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenStatusModal(res.id, 'returned')}
                    >
                      <RotateCcw size={15} />
                      Potwierdź zwrot do pracowni
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Inventory Management View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {equipmentList.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Kategoria: {item.category} &bull; S/N: {item.serialNumber} &bull; {item.location}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={`badge badge-${item.status}`}>
                  {item.status === 'available' ? 'Dostępny' : item.status === 'reserved' ? 'Zarezerwowany' : 'W serwisie'}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleToggleMaintenance(item)}
                >
                  {item.status === 'maintenance' ? 'Przywróć do dostępnych' : 'Oznacz jako w serwisie'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note & Status Change Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={
          targetStatus === 'approved'
            ? 'Zatwierdzenie wydania sprzętu'
            : targetStatus === 'rejected'
            ? 'Odrzucenie wniosku rezerwacji'
            : 'Potwierdzenie zwrotu sprzętu'
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Możesz wpisać informację lub wytyczne dla ucznia (np. godzina odbioru lub powód odrzucenia):
        </p>
        <div className="form-group">
          <label className="form-label">Wiadomość / uwagi opiekuna:</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder={
              targetStatus === 'approved'
                ? 'np. Sprzęt gotowy do odbioru w sali 104 w piątek od godziny 8:50.'
                : 'np. Sprzęt jest w tym dniu zarezerwowany dla maturzystów.'
            }
            value={caretakerNote}
            onChange={(e) => setCaretakerNote(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsNoteModalOpen(false)} disabled={actionLoading}>
            Anuluj
          </button>
          <button
            type="button"
            className={`btn ${targetStatus === 'rejected' ? 'btn-danger' : 'btn-success'}`}
            onClick={handleConfirmStatus}
            disabled={actionLoading}
          >
            {actionLoading ? 'Zapisywanie...' : 'Zastosuj zmianę statusu'}
          </button>
        </div>
      </Modal>

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Dodaj nowy sprzęt do bazy szkolnej"
      >
        {addError && (
          <div className="alert alert-error">
            <AlertTriangle size={18} />
            <span>{addError}</span>
          </div>
        )}

        <form onSubmit={handleAddEquipment}>
          <div className="form-group">
            <label className="form-label">Nazwa sprzętu</label>
            <input
              type="text"
              className="form-input"
              placeholder="np. Kamera Panasonic Lumix GH5"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategoria</label>
            <select
              className="form-select"
              value={newEquipment.category}
              onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
            >
              <option value="Kamery i aparaty">Kamery i aparaty</option>
              <option value="Laptopy">Laptopy</option>
              <option value="Elektronika i robotyka">Elektronika i robotyka</option>
              <option value="Audio i wideo">Audio i wideo</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Numer seryjny (unikalny)</label>
            <input
              type="text"
              className="form-input"
              placeholder="np. SN-PAN-5021"
              value={newEquipment.serialNumber}
              onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lokalizacja / Pracownia</label>
            <input
              type="text"
              className="form-input"
              placeholder="np. Pracownia Multimedialna 104"
              value={newEquipment.location}
              onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Opis i specyfikacja</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Krótki opis parametrów i wyposażenia..."
              value={newEquipment.description}
              onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adres URL zdjęcia (opcjonalny)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={newEquipment.imageUrl}
              onChange={(e) => setNewEquipment({ ...newEquipment, imageUrl: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)} disabled={addLoading}>
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary" disabled={addLoading}>
              {addLoading ? 'Dodawanie...' : 'Dodaj do inwentarza'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
