import { AdminTable } from "@/components/AdminTable";
import type { TableColumns } from "@/components/CustomTable";
import type { Promotion } from "@/interfaces/promotion.interface";
import { formatDateTime } from "@/utils/validation.utils";
import React from "react";

interface PromotionTableProps {
  promotions: Promotion[];
  columns: TableColumns[];
  onView: (id?: number) => void;
}

export const PromotionTable: React.FC<PromotionTableProps> = ({ promotions, columns, onView }) => {
  const toFormattedTableData = (pros: Promotion[]) => {
    return pros.map((pro) => ({
      ...pro,
      startTime: formatDateTime(pro.startTime).join(" "),
      endTime: formatDateTime(pro.endTime).join(" "),
    }));
  };
  return <AdminTable tableColumn={columns} tableData={toFormattedTableData(promotions)} handleViewClick={onView} />;
};
