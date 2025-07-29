import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Shadcn/ui/alert-dialog";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { MovieCategory, MovieCategoryFormData } from "@/interfaces/movie-category.interface";
import {
  queryCreateMovieCategory,
  queryDeleteMovieCategory,
  queryMovieCategories,
  queryUpdateMovieCategory,
  transformMovieCategoriesResponse,
} from "@/services/movieCategoryService";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { MovieCategoryDataTable } from "./MovieCategoryDataTable";
import { MovieCategoryDetail } from "./MovieCategoryDetail";

export default function MovieCategoryManagement() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<MovieCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const categoriesQuery = queryMovieCategories();
  const createCategoryMutation = queryCreateMovieCategory();
  const updateCategoryMutation = queryUpdateMovieCategory();
  const deleteCategoryMutation = queryDeleteMovieCategory();

  // Transform API response to MovieCategory interface
  const categories: MovieCategory[] = categoriesQuery.data?.result
    ? transformMovieCategoriesResponse(categoriesQuery.data.result)
    : [];

  // Filtered categories based on search
  const filteredCategories = !searchTerm
    ? categories
    : categories.filter((category) => {
        return (
          category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(category.id).includes(searchTerm)
        );
      });

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setIsDetailOpen(true);
  };

  const handleEdit = (category: MovieCategory) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleDelete = (category: MovieCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete?.id) return;

    try {
      await deleteCategoryMutation.mutateAsync({
        params: { path: { id: categoryToDelete.id } },
      });

      toast.success("Đã xóa thể loại phim thành công");
      categoriesQuery.refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Không thể xóa thể loại phim");
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (values: MovieCategoryFormData) => {
    try {
      if (selectedCategory?.id) {
        // Update existing category
        await updateCategoryMutation.mutateAsync({
          params: { path: { id: selectedCategory.id } },
          body: {
            name: values.name,
            description: values.description,
          },
        });
        toast.success("Cập nhật thể loại phim thành công");
      } else {
        // Create new category
        await createCategoryMutation.mutateAsync({
          body: {
            name: values.name,
            description: values.description,
          },
        });
        toast.success("Thêm thể loại phim mới thành công");
      }

      setIsDetailOpen(false);
      categoriesQuery.refetch();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Lỗi khi lưu thể loại phim");
    }
  };

  // Show loading state
  if (categoriesQuery.isLoading) {
    return <LoadingSpinner name="thể loại phim" />;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Quản lý thể loại phim</CardTitle>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm thể loại mới
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Tìm kiếm thể loại phim..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
          <MovieCategoryDataTable data={filteredCategories} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <MovieCategoryDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        title={selectedCategory ? "Chỉnh sửa thể loại phim" : "Thêm thể loại phim mới"}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thể loại phim "{categoryToDelete?.name}"? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
