import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((n) => {
        const isSuccess = n.type === 'success';
        const isError = n.type === 'error';

        return (
          <div key={n.id} className={`toast toast-${n.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {isSuccess && <CheckCircle2 size={18} color="var(--success)" />}
              {isError && <AlertCircle size={18} color="var(--danger)" />}
              {!isSuccess && !isError && <Info size={18} color="var(--primary)" />}
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{n.message}</span>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-light)',
                display: 'flex',
                padding: '2px'
              }}
              aria-label="Zamknij powiadomienie"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
