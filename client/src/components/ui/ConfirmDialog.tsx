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
      data-confirm-dialog
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/40 backdrop-blur-xs' />

      {/* Dialog */}
      <div
        className='relative bg-[#fcfcfc] border border-[#dfdfdf] rounded-xl shadow-lg max-w-md w-full mx-4 py-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className='text-lg font-medium text-[#32302c] mb-3 pb-3 border-b border-[#dfdfdf] px-6'>
          {title}
        </h2>

        {/* Message */}
        <p className='text-[#525252] mb-6 leading-relaxed px-6 pb-3 border-b border-[#dfdfdf]'>
          {message}
        </p>

        {/* Actions */}
        <div className='flex gap-3 px-6'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-[#171717] bg-[#f9f8f7] border border-[#d4d4d4] rounded-lg hover:bg-[#ededed] hover:border-[#8f8f8f] transition-colors cursor-pointer w-full'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 text-sm font-medium text-[#171717] bg-[#fef1ef] border border-[#f3b0a2] rounded-lg hover:bg-[#fdd8d3] hover:border-[#df2900] transition-colors cursor-pointer w-full'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
