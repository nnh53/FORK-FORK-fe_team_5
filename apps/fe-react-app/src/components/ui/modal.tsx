import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel: string;
  cancelLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSubmit, submitLabel, cancelLabel = 'Hủy' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-500">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn btn-ghost border border-gray-300 text-black px-4 py-2 rounded-md">
            {cancelLabel}
          </button>
          <button onClick={onSubmit} className="btn btn-primary bg-red-500 text-white px-4 py-2 rounded-md">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
