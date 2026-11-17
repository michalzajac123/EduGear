import { GitBranch, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <strong>EduGear</strong> – System Rezerwacji Sprzętu Szkolnego &bull; Autor: <strong>Michał Zając</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Projekt semestralny</span>
          <a
            href="https://github.com/michalzajac123/EduGear"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}
          >
            <GitBranch size={16} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
