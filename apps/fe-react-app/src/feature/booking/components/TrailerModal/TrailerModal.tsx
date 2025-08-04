import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { getYouTubeEmbedUrl } from "@/utils/movie.utils";
import React from "react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  if (!isOpen || !trailerUrl) return null;

  // Use utility function from movieUtils with autoplay enabled
  const embedUrl = getYouTubeEmbedUrl(trailerUrl, { autoplay: true, rel: false });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-full p-1 sm:p-2 md:min-w-3xl md:p-4 lg:min-w-4xl">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>{movieTitle} - Trailer</DialogTitle>
          <button
            onClick={onClose}
            className="ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="mt-2 aspect-video w-full">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} - Trailer`}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full rounded"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
              <div className="text-center text-gray-600">
                <p className="mb-2">⚠️ URL trailer không hợp lệ</p>
                <p className="text-sm">Vui lòng kiểm tra lại đường dẫn YouTube</p>
                <div className="mx-auto mt-2 max-w-md text-xs break-all text-gray-400">URL: {trailerUrl}</div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
