import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Icon } from "@iconify/react";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movieTitle: string;
  cinemaName: string;
  selectedDate: string;
  selectedTime: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TicketConfirmModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, movieTitle, cinemaName, selectedDate, selectedTime }) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-700 uppercase">BẠN ĐANG ĐẶT VÉ XEM PHIM</DialogTitle>
        </DialogHeader>

        {/* Nội dung chính */}
        <div className="p-8 flex flex-col items-center text-center gap-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-red-600">{movieTitle}</h1>

          {/* Khung thông tin */}
          <div className="w-full bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-3 gap-4">
              {/* Cột Rạp chiếu */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Rạp chiếu</p>
                <p className="text-base font-semibold text-black">{cinemaName}</p>
              </div>
              {/* Cột Ngày chiếu */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Ngày chiếu</p>
                <p className="text-base font-semibold text-black">{formatDate(selectedDate)}</p>
              </div>
              {/* Cột Giờ chiếu */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Giờ chiếu</p>
                <p className="text-base font-semibold text-black">{selectedTime}</p>
              </div>
            </div>
          </div>

          {/* Nút Đồng ý */}
          <button
            onClick={onConfirm}
            className="w-1/3 h-11 bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:brightness-110 text-white font-bold rounded-md
                     transition duration-200 flex items-center justify-center text-base relative mt-4
                     cursor-pointer"
          >
            <Icon icon="material-symbols-light:local-activity-rounded" width="60" height="60" />
            <span>ĐỒNG Ý</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketConfirmModal;
