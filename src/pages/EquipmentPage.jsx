import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { equipmentService } from '../services/equipmentService';
import ReservationModal from '../components/reservations/ReservationModal';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Lock
} from 'lucide-react';

export default function EquipmentPage({ onNavigate }) {
  const { isAuthenticated, isCaretaker } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Selected item for modal
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await equipmentService.getAllEquipment({
        category,
        status,
        search
      });
      if (res.success) {
        setEquipmentList(res.data);
      }
    } catch (err) {
      setError(err.message || 'Nie udało się pobrać listy sprzętu.');
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEquipment]);

  const handleOpenReserve = (item) => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    setSelectedEquipment(item);
    setIsModalOpen(true);
  };

  const getStatusBadge = (itemStatus) => {
    switch (itemStatus) {
      case 'available':
        return <span className="badge badge-available"><CheckCircle size={12} /> Dostępny</span>;
      case 'reserved':
        return <span className="badge badge-reserved"><Clock size={12} /> Zarezerwowany</span>;
      case 'maintenance':
        return <span className="badge badge-maintenance"><AlertTriangle size={12} /> W serwisie</span>;
      default:
        return <span className="badge">{itemStatus}</span>;
    }
  };

  const categories = [
    'all',
    'Kamery i aparaty',
    'Laptopy',
    'Elektronika i robotyka',
    'Audio i wideo'
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Katalog Sprzętu Szkolnego</h2>
          <p>Przeglądaj wyposażenie pracowni, sprawdzaj dostępność i twórz rezerwacje</p>
        </div>
        {isAuthenticated && isCaretaker && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('caretaker')}
          >
            Zarządzaj inwentarzem (Panel Opiekuna)
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search text */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Szukaj po nazwie, opisie, sali..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={16}
              color="var(--text-light)"
              style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none' }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Wszystkie kategorie</option>
              {categories.filter(c => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="available">Tylko dostępne</option>
              <option value="reserved">Zarezerwowane</option>
              <option value="maintenance">W serwisie</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <p>Ładowanie sprzętu...</p>
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Layers size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3>Nie znaleziono sprzętu</h3>
          <p>Spróbuj zmienić parametry wyszukiwania lub filtry kategorii.</p>
        </div>
      ) : (
        <div className="grid-3">
          {equipmentList.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {item.category}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                  {item.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <MapPin size={13} />
                    <span>Lokalizacja: <strong>{item.location}</strong></span>
                  </div>
                  <div>Nr seryjny: <strong>{item.serialNumber}</strong></div>
                </div>

                {item.status === 'maintenance' ? (
                  <button type="button" className="btn btn-secondary" disabled style={{ width: '100%' }}>
                    Sprzęt w serwisie
                  </button>
                ) : !isAuthenticated ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onNavigate('login')}
                    style={{ width: '100%' }}
                  >
                    <Lock size={15} />
                    Zaloguj się, aby rezerwować
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleOpenReserve(item)}
                    style={{ width: '100%' }}
                  >
                    <Calendar size={15} />
                    Zarezerwuj sprzęt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipment={selectedEquipment}
        onSuccess={() => {
          fetchEquipment();
        }}
      />
    </div>
  );
}
