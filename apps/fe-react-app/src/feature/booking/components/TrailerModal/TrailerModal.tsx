import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen || !trailerUrl) return null;

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(trailerUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl min-w-4xl w-full ">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>{movieTitle} - Trailer</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="aspect-video w-full mt-2">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>URL trailer không hợp lệ.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
