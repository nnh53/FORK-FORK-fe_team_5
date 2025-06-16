import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Promotion } from "@/interfaces/promotion.interface.";
import { AdminTable } from "@/utils/AdminTable";
import { type TableColumns } from "@/utils/Table";
import { formatDateTime, promotionValidationSchema } from "@/utils/validation.utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Plus } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialValues: Omit<Promotion, "id"> = {
  image: "",
  title: "",
  type: "",
  minPurchase: 0,
  discountValue: 0,
  startTime: "",
  endTime: "",
  description: "",
  status: "inactive",
};

export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [open, setOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const promotionColumn: TableColumns[] = [
    {
      header: "#",
      accessorKey: "id",
      width: "w-[5%]",
    },
    {
      header: "Tên",
      accessorKey: "title",
      width: "w-[10%]",
    },
    {
      header: "Nội dung",
      accessorKey: "description",
      width: "w-[20%]",
    },
    {
      header: "Mức giảm giá",
      accessorKey: "discountValue",
    },
    {
      header: "Mức áp dụng",
      accessorKey: "minPurchase",
      width: "w-[10%]",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
    },
    {
      header: "Loại",
      accessorKey: "type",
    },
    {
      header: "Bắt đầu",
      accessorKey: "startTime",
    },
    {
      header: "Kết thúc",
      accessorKey: "endTime",
    },
  ];
  const getPromotions = async () => {
    try {
      const res = await fetch("http://localhost:3000/promotions");
      if (res.ok) {
        const promotionData: Promotion[] = await res.json();
        setPromotions(promotionData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  const handleOpenDialog = (id: number) => {
    const promotion: Promotion | undefined = promotions.find((pro) => pro.id == id);
    console.log("promo", promotion);
    if (promotion != undefined) {
      setSelectedPromotion(promotion);
      setOpen(true);
    }
  };

  const toFormattedTableData = (pros: Promotion[]) => {
    return pros.map((pro) => ({
      ...pro,
      startTime: formatDateTime(pro.startTime).join(" "),
      endTime: formatDateTime(pro.endTime).join(" "),
    }));
  };

  const toFormattedFormData = (pro: Promotion) => {
    return {
      ...pro,
      startTime: new Date(pro.startTime).toISOString().slice(0, 16),
      endTime: new Date(pro.endTime).toISOString().slice(0, 16),
    };
  };
  const formInitialValues = selectedPromotion ? toFormattedFormData(selectedPromotion) : initialValues;
  const formattedTableData = toFormattedTableData(promotions);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const onOpen = () => {
    setSelectedPromotion(undefined);
    if (open) setImagePreview(null);
    setOpen(!open);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Promotion Management</CardTitle>
            </div>
            <Button onClick={onOpen}>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex w-full max-w-md">
              <Input
                type="text"
                placeholder="Search cinema rooms..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={28}
                className="mr-2"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <AdminTable tableColumn={promotionColumn} tableData={formattedTableData} />
          </CardContent>
        </Card>
      </div>

      {/*  */}
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2x1  min-w-[50%]"
          onCloseAutoFocus={() => {
            setSelectedPromotion(undefined);
          }}
        >
          <DialogHeader>
            <DialogTitle>Promo Details</DialogTitle>
          </DialogHeader>
          {formInitialValues && (
            <Formik
              initialValues={formInitialValues}
              validationSchema={promotionValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log("submit", values);
                setSubmitting(false);
              }}
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <Form className="space-y-6 ">
                  {/* Image URL */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-40 h-40" />
                      ) : (
                        formInitialValues.image && <img src={formInitialValues.image} className="w-100" />
                      )}
                      <input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        className="input input-bordered w-full pr-2 border-gray-300 rounded-md mt-3"
                        placeholder=""
                        hidden
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            setFieldValue("image", file);
                            const reader = new FileReader();
                            reader.onloadend = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        className="btn bg-[#44b6ae] hover:bg-[#50918c] text-black border-gray-300 font-semibold text-white"
                      >
                        TẢI ẢNH LÊN
                      </button>
                    </div>
                    <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      placeholder="Enter promotion title"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Loại khuyến mãi
                    </label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    >
                      <option value="">Chọn loại khuyến mãi</option>
                      <option value="percentage">Giảm giá phần trăm</option>
                      <option value="fixed">Giảm giá khoảng cụ thể</option>
                      <option value="buy_one_get_one">Mua 1 tặng 1</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Min Purchase and Discount Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-2">
                        Đơn tối thiểu
                      </label>
                      <Field
                        type="number"
                        id="minPurchase"
                        name="minPurchase"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      />
                      <ErrorMessage name="minPurchase" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
                        Giá trị giảm giá {values.type === "percentage" ? "(%)" : "($)"}
                      </label>
                      <Field
                        type="number"
                        id="discountValue"
                        name="discountValue"
                        min="0"
                        step={values.type === "percentage" ? "1" : "0.01"}
                        max={values.type === "percentage" ? "100" : undefined}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      />
                      <ErrorMessage name="discountValue" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Start Time and End Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian bắt đầu
                      </label>
                      <Field
                        type="dateTime-local"
                        id="startTime"
                        name="startTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      />
                      <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian kết thúc
                      </label>
                      <Field
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      />
                      <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      placeholder="Enter promotion description"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    >
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="expired">Expired</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Đang lưu..." : selectedPromotion ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi"}
                    </Button>
                    {selectedPromotion && (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          )}
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setSelectedPromotion(undefined);
                setOpen(false);
              }}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
