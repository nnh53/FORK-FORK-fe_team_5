import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import type { MyInfoData } from "../../interfaces/users.interface";
import { MyInfoSchema } from "../../utils/validation.utils";

export const MyInfo: React.FC = () => {
  const [formData, setFormData] = useState<MyInfoData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setError] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/myInfo");
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const user: MyInfoData = await response.json();
        setFormData(user);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user profile:", err);
      }
    };
    getUser();
  }, []);
  if (errors) {
    return (
      <>
        <h1 className="text-red-500">Có lỗi xảy ra</h1>
      </>
    );
  }
  function normalizeUserData(user: MyInfoData) {
    return {
      city: user?.city || "",
      district: user?.district || "",
      dob: user?.dob ? user.dob.split("T")[0] : "",
      id: user?.id,
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      gender: user?.gender || "",
      img: user?.img || "",
    };
  }

  if (!formData) {
    return <div>Loading profile...</div>;
  }
  if (errors) {
    return <h1 className="text-red-500">Có lỗi xảy ra</h1>;
  }
  return (
    <>
      <Formik
        initialValues={normalizeUserData(formData)}
        enableReinitialize
        validationSchema={MyInfoSchema}
        onSubmit={(values) => {
          // api call here
          console.log("why it not running ");
          console.log("Submitted data:", values);
        }}
      >
        {({ setFieldValue, handleSubmit, errors }) => {
          return (
            <Form onSubmit={handleSubmit}>
              {/* <!-- Avatar Upload Section --> */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="relative min-w-48">
                  {imagePreview ? <img src={imagePreview} className="w-40 h-40" /> : formData.img && <img src={formData.img} className="w-40 h-40" />}
                  <input
                    ref={fileInputRef}
                    id="img"
                    type="file"
                    className="input input-bordered w-full pr-2"
                    placeholder=""
                    hidden
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        setFieldValue("avatar", file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="btn bg-[#44b6ae] hover:bg-[#50918c] text-black border-gray-300 font-semibold text-white"
                >
                  TẢI ẢNH LÊN
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* <!-- Họ tên --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">
                      Họ tên <span className="text-red-500">*{errors.name}</span>
                    </span>
                  </label>
                  <Field name="name" type="text" className="input input-bordered w-full !bg-white" />
                </div>

                {/* <!-- Email --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">
                      Email <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                      </svg>
                    </div>
                    <Field name="email" className="input input-bordered w-full pl-10 bg-gray-100 cursor-not-allowed" readOnly />
                  </div>
                </div>

                {/* <!-- Số điện thoại --> */}
                <div className="form-control">
                  <label className="label pb-1" htmlFor="phone">
                    <span className="label-text font-medium text-gray-800">
                      Số điện thoại <span className="text-red-500">*{errors.phone}</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-3 bg-gray-100 border-r border-gray-300 rounded-l-lg z-10 ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                        <path
                          fillRule="evenodd"
                          d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5h-1.528a13.528 13.528 0 0 1-11.9-11.9A1.5 1.5 0 0 1 3.5 3H5a.5.5 0 0 1 0 1H3.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Field name="phone" type="tel" className="input input-bordered w-full pl-16  !bg-white" />
                  </div>
                </div>

                {/* <!-- Ngày sinh --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">
                      Ngày sinh <span className="text-red-500">*{errors.dob}</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-3 bg-gray-100 border-r border-gray-300 rounded-l-lg z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                        <path
                          fillRule="evenodd"
                          d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Field name="dob" type="date" className="input input-bordered w-full pl-16 !bg-white" />
                  </div>
                </div>

                {/* <!-- Giới tính --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">Giới tính</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center p-3 bg-gray-100 border-r border-gray-300 rounded-l-lg z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.25 1.25 0 0 0-2.43 1.004l.425 4.5A1.25 1.25 0 0 0 2.71 21h14.58a1.25 1.25 0 0 0 1.25-1.004l.425-4.5a1.25 1.25 0 0 0-2.43-1.004L15.07 18.5H4.93l-1.465-4.007Z" />
                      </svg>
                    </div>
                    <Field as="select" name="gender" className="select select-bordered w-full pl-16 !bg-white cursor-pointer">
                      <option value="default">Default</option>
                      <option value="Nam">Nam</option>
                      <option value="Nu">Nữ</option>
                      <option value="BD">Khác</option>
                    </Field>
                  </div>
                </div>

                {/* <!-- Tỉnh/Thành phố --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">Tỉnh/Thành phố</span>
                  </label>
                  <Field as="select" name="city" className="select select-bordered w-full !bg-white cursor-pointer">
                    <option value="">Default</option>
                    <option value="ba ria">Tỉnh Bà Rịa - Vũng Tàu</option>
                    <option value="ho chi minh">Thành phố Hồ Chí Minh</option>
                    <option value="ha noi">Thành phố Hà Nội</option>
                  </Field>
                </div>

                {/* <!-- Quận/Huyện --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">Quận/Huyện</span>
                  </label>
                  <Field as="select" name="district" className="select select-bordered w-full !bg-white cursor-pointer">
                    <option value="">Default</option>
                    <option>Huyện Xuyên Mộc</option>
                    <option>Thành phố Vũng Tàu</option>
                    <option>Thành phố Bà Rịa</option>
                  </Field>
                </div>

                {/* <!-- Địa chỉ --> */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-gray-800">Địa chỉ</span>
                  </label>
                  <Field
                    as="textarea"
                    name="address"
                    className="block textarea textarea-bordered h-10 w-full !bg-white"
                    placeholder="Địa chỉ"
                  ></Field>
                </div>
              </div>

              {/* <!-- Change Password Link --> */}
              <div className="mt-8">
                <a href="#" className="text-red-600 hover:underline text-sm">
                  Đổi mật khẩu?
                </a>
              </div>

              {/* <!-- Update Button --> */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="btn  bg-gradient-to-r from-[#E52226] to-[#550e0f94]  text-white px-16 text-base font-bold hover:to-[#f37c7e]"
                >
                  CẬP NHẬT
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
