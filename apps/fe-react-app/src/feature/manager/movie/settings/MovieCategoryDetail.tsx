import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import type { MovieCategory, MovieCategoryFormData } from "@/interfaces/movie-category.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MovieCategoryDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MovieCategoryFormData) => void;
  category?: MovieCategory;
  title: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Tên thể loại là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  isActive: z.boolean().optional(),
});

export function MovieCategoryDetail({ isOpen, onClose, onSubmit, category, title }: Readonly<MovieCategoryDetailProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      isActive: true,
    },
  });

  // Update form when category changes
  React.useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        isActive: true,
      });
    }
  }, [category, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: category?.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thể loại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thể loại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả về thể loại phim" className="h-20 resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
