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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-400 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-red-500">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-700 text-10xl">
            X
          </button>
        </div>
        <div className="mb-6 text-gray-900">{children}</div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn border border-gray-300 text-red-500 px-4 py-2 rounded-md hover:bg-gray-100">
            {cancelLabel}
          </button>
          <button onClick={onSubmit} className="btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
