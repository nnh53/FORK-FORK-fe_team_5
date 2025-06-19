// filepath: c:\Users\Hii\Desktop\OJT\fe_team_5\apps\fe-react-app\src\feature\manager\food-combo\food\FoodForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface FoodFormProps {
  food?: Food;
  onSubmit: (data: Omit<Food, "id">) => void;
  onCancel: () => void;
}

const FoodForm: React.FC<FoodFormProps> = ({ food, onSubmit, onCancel }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Omit<Food, "id">>();

  useEffect(() => {
    if (food) {
      reset({
        comboId: food.comboId,
        img: food.img,
        name: food.name,
        category: food.category,
        size: food.size,
        flavor: food.flavor,
        price: food.price,
        quantity: food.quantity,
        status: food.status,
      });
    }
  }, [food, reset]);

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{food ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Combo ID</label>
          <Controller
            name="comboId"
            control={control}
            rules={{ required: "Combo ID là bắt buộc" }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Nhập Combo ID"
                className={errors.comboId ? "border-red-500" : ""}
              />
            )}
          />
          {errors.comboId && <p className="text-red-500 text-sm mt-1">{errors.comboId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL hình ảnh</label>
          <Controller
            name="img"
            control={control}
            rules={{ required: "URL hình ảnh là bắt buộc" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nhập URL hình ảnh"
                className={errors.img ? "border-red-500" : ""}
              />
            )}
          />
          {errors.img && <p className="text-red-500 text-sm mt-1">{errors.img.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tên món ăn</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên món ăn là bắt buộc" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nhập tên món ăn"
                className={errors.name ? "border-red-500" : ""}
              />
            )}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Danh mục là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Thức ăn</SelectItem>
                  <SelectItem value="drink">Đồ uống</SelectItem>
                  <SelectItem value="combo">Combo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kích thước</label>
          <Controller
            name="size"
            control={control}
            rules={{ required: "Kích thước là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.size ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn kích thước" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hương vị</label>
          <Controller
            name="flavor"
            control={control}
            rules={{ required: "Hương vị là bắt buộc" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nhập hương vị"
                className={errors.flavor ? "border-red-500" : ""}
              />
            )}
          />
          {errors.flavor && <p className="text-red-500 text-sm mt-1">{errors.flavor.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <Controller
            name="price"
            control={control}
            rules={{ required: "Giá là bắt buộc", min: { value: 0, message: "Giá phải lớn hơn 0" } }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Nhập giá"
                className={errors.price ? "border-red-500" : ""}
              />
            )}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số lượng</label>
          <Controller
            name="quantity"
            control={control}
            rules={{ required: "Số lượng là bắt buộc", min: { value: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" } }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Nhập số lượng"
                className={errors.quantity ? "border-red-500" : ""}
              />
            )}
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Trạng thái là bắt buộc" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Có sẵn</SelectItem>
                  <SelectItem value="sold">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {food ? "Cập nhật" : "Thêm"} món ăn
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
