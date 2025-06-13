import { formatDateTime } from "@/utils/validation.utils";
import { useEffect, useState } from "react";
import type { MyPoint, MyPointHistory } from "../../interfaces/users.interface";
import { CustomTable, type TableColumns } from "../../utils/Table";

export const MyPointManagement: React.FC = () => {
  const tableColumns: TableColumns[] = [
    {
      header: "Thời gian",
      accessorKey: "date",
      width: "w-[15%]",
    },
    {
      header: "Số điểm",
      accessorKey: "points",
      width: "w-[20%]",
    },
    {
      header: "Nội dung sử dụng",
      accessorKey: "description",
    },
  ];
  const [pointSummary, setPointSummary] = useState<MyPoint | null>(null);
  const [tableData, setTableData] = useState<MyPointHistory[]>([]);
  const [errors, setError] = useState<string | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:3000/myPoint");
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MyPoint = await response.json();

        const formattedData: MyPointHistory[] = data.pointHistory.map((record) => ({
          ...record,
          date: formatDateTime(record.date).toString(),
        }));
        setPointSummary(data);
        setTableData(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching user profile:", err);
      }
    };
    getData();
  }, []);
  if (!tableData) {
    return <div>Loading profile...</div>;
  }
  console.log(errors);
  return (
    <>
      <h2 className="text-2xl font-bold text-[#E52226] uppercase mb-5">Tổng quan</h2>
      <div className="space-y-3 text-lg text-gray-800 w-[20%] mb-10">
        {/* Row 1: Accumulated Points */}
        <div className="flex justify-between items-center">
          <span>Điểm đã tích luỹ</span>
          <span className="font-medium">{pointSummary?.accumulatePoints} điểm</span>
        </div>

        {/* Row 2: Used Points */}
        <div className="flex justify-between items-center">
          <span>Điểm đã sử dụng</span>
          <span className="font-medium">{pointSummary?.usedPoints} điểm</span>
        </div>

        {/* Row 3: Available Points */}
        <div className="flex justify-between items-center">
          <span>Điểm hiện có</span>
          <span className="font-medium">{pointSummary?.availablePoints} điểm</span>
        </div>

        {/* Row 4: Near Expiring Points */}
        <div className="flex justify-between items-center">
          <span>Điểm sắp hết hạn</span>
          <span className="font-medium">{pointSummary?.nearExpiringPoints} điểm</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[#E52226] uppercase mb-5">Lịch sử điểm</h2>
      <CustomTable tableColumns={tableColumns} tableData={tableData} />{" "}
    </>
  );
};
