import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import type { MovieCategory } from "@/interfaces/movie-category.interface";

interface MovieCategoryViewDialogProps {
  category: MovieCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieCategoryViewDialog({ category, isOpen, onClose }: Readonly<MovieCategoryViewDialogProps>) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thông tin thể loại phim</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">ID</h3>
            <p className="text-sm text-gray-500">{category.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tên thể loại</h3>
            <p className="text-sm text-gray-500">{category.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Mô tả</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
