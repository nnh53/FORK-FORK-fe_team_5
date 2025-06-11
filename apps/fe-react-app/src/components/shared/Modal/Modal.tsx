import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerClassName?: string;
}

const DRAG_THRESHOLD = 200;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, containerClassName = 'w-full max-w-lg' }) => {
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
    if (modalRef.current) {
      modalRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging || startYRef.current === null) return;

    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) {
      setOffsetY(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    if (modalRef.current) {
      modalRef.current.style.transition = 'transform 0.3s ease';
    }

    if (offsetY > DRAG_THRESHOLD) {
      onClose();
    } else {
      setOffsetY(0);
    }

    setIsDragging(false);
    startYRef.current = null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => handleDragStart(e.clientY);
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => handleDragStart(e.touches[0].clientY);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientY);
    const onTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, offsetY]); // cần đưa offsetY vào để đảm bảo cập nhật đúng

  useEffect(() => {
    if (isOpen) {
      setOffsetY(0);
      setIsDragging(false);
      startYRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 transition-opacity duration-300" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl relative z-10 ${containerClassName}`}
        style={{ transform: `translateY(${offsetY}px)` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-800 transition-colors z-20"
          aria-label="Đóng modal"
        >
          &times;
        </button>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
