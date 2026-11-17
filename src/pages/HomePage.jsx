import { useAuth } from '../context/AuthContext';
import {
  Package,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

export default function HomePage({ onNavigate }) {
  const { isAuthenticated, isCaretaker, user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2.5rem',
          color: '#ffffff',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Sparkles size={14} />
            EduGear &bull; System Pracowni Szkolnej
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            Koniec z papierowymi i ustnymi zapisami na sprzęt szkolny
          </h1>
          <p style={{ color: '#e0e7ff', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Sprawdzaj w czasie rzeczywistym dostępność aparatów fotograficznych, laptopów, kamer i zestawów Arduino.
            Rezerwuj termin w kilka sekund i odbieraj sprzęt u opiekuna pracowni.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-lg"
              style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
              onClick={() => onNavigate('equipment')}
            >
              <Layers size={18} />
              Przeglądaj sprzęt
            </button>

            {!isAuthenticated ? (
              <button
                type="button"
                className="btn btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
                onClick={() => onNavigate('login')}
              >
                Zaloguj się do systemu
                <ArrowRight size={18} />
              </button>
            ) : isCaretaker ? (
              <button
                type="button"
                className="btn btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
                onClick={() => onNavigate('caretaker')}
              >
                <ShieldCheck size={18} />
                Panel Opiekuna
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
                onClick={() => onNavigate('reservations')}
              >
                <Calendar size={18} />
                Moje rezerwacje
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3 Main Features */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2>Główne funkcjonalności systemu</h2>
          <p style={{ marginTop: '0.5rem' }}>Dedykowane rozwiązanie dla uczniów i opiekunów szkolnych pracowni</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Package size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>1. Przeglądanie sprzętu</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Pełny inwentarz szkolnego wyposażenia multimedialnego i technicznego z opisami parametrów, numerami seryjnymi i bieżącym statusem dostępności.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Calendar size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>2. Rezerwacje terminowe</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Wybór przedziału dat (od–do), automatyczna weryfikacja konfliktów terminów oraz formularz celu wypożyczenia ze ścisłą walidacją danych.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>3. Panel Opiekuna Pracowni</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Autoryzowane zatwierdzanie lub odrzucanie wniosków uczniów, zarządzanie stanem technicznym sprzętu i pełna kontrola nad terminami zwrotów.
            </p>
          </div>
        </div>
      </section>

      {/* How it works workflow */}
      <section className="card" style={{ padding: '2.5rem', background: '#ffffff', marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Jak działa rezerwacja w 4 krokach?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              1
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Logowanie</h4>
            <p style={{ fontSize: '0.8125rem' }}>Zaloguj się na swoje konto ucznia lub opiekuna z bezpiecznym haszowaniem haseł.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              2
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Wybór sprzętu</h4>
            <p style={{ fontSize: '0.8125rem' }}>Filtruj według kategorii (kamery, laptopy, zestawy Arduino) i sprawdź specyfikację.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              3
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Wysłanie wniosku</h4>
            <p style={{ fontSize: '0.8125rem' }}>Wskaż daty rezerwacji i podaj cel wypożyczenia do akceptacji opiekuna.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              4
            </div>
            <h4 style={{ marginBottom: '0.5rem' }}>Zatwierdzenie i odbiór</h4>
            <p style={{ fontSize: '0.8125rem' }}>Opiekun zatwierdza wniosek w swoim panelu i wydaje sprzęt w pracowni.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
