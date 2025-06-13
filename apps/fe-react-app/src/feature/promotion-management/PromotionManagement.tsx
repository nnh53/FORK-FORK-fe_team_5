import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Promotion } from "@/interfaces/promotion.interface.";
import { CustomTable, type TableColumns } from "@/utils/Table";
import { formatDateTime } from "@/utils/validation.utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type React from "react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const promotionValidationSchema = Yup.object({
  image: Yup.string().url("Must be a valid URL").required("Image URL is required"),
  title: Yup.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters").required("Title is required"),
  type: Yup.string().oneOf(["percentage", "fixed", "buy_one_get_one", "free_shipping"], "Invalid promotion type").required("Type is required"),
  minPurchase: Yup.number().min(0, "Minimum purchase must be at least 0").required("Minimum purchase is required"),
  discountValue: Yup.number()
    .min(0, "Discount value must be at least 0")
    .when("type", {
      is: "percentage",
      then: (schema) => schema.max(100, "Percentage discount cannot exceed 100%"),
      otherwise: (schema) => schema,
    })
    .required("Discount value is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("end-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return new Date(value) > new Date(startTime);
    }),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  status: Yup.string().oneOf(["active", "inactive", "scheduled", "expired"], "Invalid status").required("Status is required"),
});
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
interface PromotionFormProps {
  onSubmit: (values: Omit<Promotion, "id">) => void;
  initialData?: Partial<Promotion>;
}
export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [open, setOpen] = useState<boolean>(false);
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
      width: "w-[30%]",
    },
    {
      header: "Mức giảm giá",
      accessorKey: "discountValue",
      width: "w-[10%]",
    },
    {
      header: "Mức áp dụng",
      accessorKey: "minPurchase",
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

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const res = await fetch("http://localhost:3000/promotions");
        if (res.ok) {
          const promotionData: Promotion[] = await res.json();
          const formattedData: Promotion[] = promotionData.map((pro) => ({
            ...pro,
            startTime: formatDateTime(pro.startTime).join(" "),
            endTime: formatDateTime(pro.endTime).join(" "),
          }));
          setPromotions(formattedData);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPromotions();
  }, []);

  const handleOpenDialog = (pro: Promotion) => {
    setSelectedPromotion(pro);
    if (pro) setOpen(true);
  };
  const formInitialValues = selectedPromotion ? { ...initialValues, ...selectedPromotion } : initialValues;

  console.log("data", selectedPromotion);
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{selectedPromotion ? "Edit Promotion" : "Create New Promotion"}</h2>
      <CustomTable tableColumns={promotionColumn} tableData={promotions} action={handleOpenDialog}></CustomTable>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2x1 bg-red-500 !container-7xl">
          <DialogHeader>
            <DialogTitle>Promo Details</DialogTitle>
          </DialogHeader>
          {selectedPromotion && (
            <Formik
              initialValues={formInitialValues}
              validationSchema={promotionValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log("submit", values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="space-y-6 ">
                  {/* Image URL */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <Field
                      type="url"
                      id="image"
                      name="image"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter promotion title"
                    />
                    <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Type
                    </label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select promotion type</option>
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Amount Discount</option>
                      <option value="buy_one_get_one">Buy One Get One</option>
                      <option value="free_shipping">Free Shipping</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Min Purchase and Discount Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Purchase ($)
                      </label>
                      <Field
                        type="number"
                        id="minPurchase"
                        name="minPurchase"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="minPurchase" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value {values.type === "percentage" ? "(%)" : "($)"}
                      </label>
                      <Field
                        type="number"
                        id="discountValue"
                        name="discountValue"
                        min="0"
                        step={values.type === "percentage" ? "1" : "0.01"}
                        max={values.type === "percentage" ? "100" : undefined}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="discountValue" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Start Time and End Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <Field
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <Field
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter promotion description"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="expired">Expired</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : selectedPromotion ? "Update Promotion" : "Create Promotion"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
          <DialogFooter className="mt-4">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
