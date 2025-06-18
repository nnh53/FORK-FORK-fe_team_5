import { DatePicker } from "@/utils/DatePicker";
import { useEffect, useState } from "react";
import type { MyVoucher, MyVoucherHistory } from "../../interfaces/voucher.interface";
import { CustomTable, type TableColumns } from "../../utils/Table";
import { formatDateTime } from "../../utils/validation.utils";

export const MyVoucherManagement: React.FC = () => {
  const voucherColumns: TableColumns[] = [
    {
      header: "Mã Voucher",
      accessorKey: "voucherId",
      width: "w-[15%]",
    },
    {
      header: "Nội dung voucher",
      accessorKey: "voucherDescription",
      width: "w-[30%]",
    },
    {
      header: "Loại voucher",
      accessorKey: "voucherType",
    },
    {
      header: "Ngày hết hạn",
      accessorKey: "expiredDate",
    },
  ];

  const voucherHistoryColumns: TableColumns[] = [
    {
      header: "Thời gian",
      accessorKey: "date",
      width: "w-[15%]",
    },
    {
      header: "Mã voucher",
      accessorKey: "voucherId",
      width: "w-[30%]",
    },
    {
      header: "Nội dung voucher",
      accessorKey: "voucherDescription",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
    },
  ];
  const [myVoucherData, setMyVoucherData] = useState<MyVoucher[] | null>([]);
  const [myVoucherHistory, setMyVoucherHistory] = useState<MyVoucherHistory[] | null>([]);
  const [errors, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const getVoucher = async () => {
      try {
        const response = await fetch("http://localhost:3000/myVoucher");
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MyVoucher[] = await response.json();
        const formattedData: MyVoucher[] = data.map((record) => ({
          ...record,
          expiredDate: formatDateTime(record.expiredDate).join(" "),
        }));
        setMyVoucherData(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user profile:", err);
      }
    };
    const getVoucherHistory = async () => {
      try {
        const response = await fetch("http://localhost:3000/myVoucherHistory");
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MyVoucherHistory[] = await response.json();
        const formattedData: MyVoucherHistory[] = data.map((record) => ({
          ...record,
          date: formatDateTime(record.date).join(" "),
        }));
        setMyVoucherHistory(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user profile:", err);
      }
    };
    getVoucher();
    getVoucherHistory();
  }, []);
  if (!myVoucherData || !myVoucherHistory) {
    return <div>Loading profile...</div>;
  }
  console.log(errors);
  return (
    <>
      <h2 className="text-2xl font-bold text-[#E52226] uppercase mb-5">Voucher hiện có</h2>
      <CustomTable tableColumns={voucherColumns} tableData={myVoucherData} />

      <h2 className="text-2xl font-bold text-[#E52226] uppercase mb-5 mt-20">Lịch sử sử dụng Voucher</h2>
      <div className="mb-4 flex gap-4">
        <DatePicker value={from} setValue={setFrom} label="From date" />
        <DatePicker value={to} setValue={setTo} label="To date" />
      </div>
      <CustomTable tableColumns={voucherHistoryColumns} tableData={myVoucherHistory} />
    </>
  );
};
