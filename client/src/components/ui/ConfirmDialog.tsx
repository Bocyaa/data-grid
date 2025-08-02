import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Dialog */}
      <div
        className='relative bg-[#ffffff] border border-[#eeeeec] rounded-2xl shadow-lg max-w-md w-full mx-4 p-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className='text-lg font-semibold text-[#32302c] mb-3'>{title}</h2>

        {/* Message */}
        <p className='text-[#5f5e5b] mb-6 leading-relaxed'>{message}</p>

        {/* Actions */}
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-[#5f5e5b] bg-[#f9f8f7] border border-[#eeeeec] rounded-lg hover:bg-[#f1f0ef] hover:border-[#e5e5e5] transition-colors cursor-pointer'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors cursor-pointer'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
