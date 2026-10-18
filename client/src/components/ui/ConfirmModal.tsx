interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-6">
        <h2 className="font-semibold text-lg text-ink mb-2">{title}</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}
            className="bg-surface hover:bg-surface text-muted hover:text-ink border border-line rounded-lg px-4 py-2 text-sm transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${danger ? 'bg-red-400 hover:bg-red-500' : 'bg-brand hover:bg-brand/90'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
