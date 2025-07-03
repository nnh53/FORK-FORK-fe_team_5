import { AdminTable } from "@/components/AdminTable";
import type { TableColumns } from "@/components/CustomTable";
import type { Promotion } from "@/interfaces/promotion.interface";
import { formatPromotionDate } from "@/services/promotionService";
import { forwardRef, useImperativeHandle } from "react";

interface PromotionTableProps {
  promotions: Promotion[];
  columns: TableColumns[];
  onView: (id?: number) => void;
}

export const PromotionTable = forwardRef<{ resetPagination: () => void }, PromotionTableProps>(({ promotions, columns, onView }, ref) => {
  // Expose resetPagination method to parent component
  useImperativeHandle(ref, () => ({
    resetPagination: () => {
      // Pagination is actually handled internally by AdminTable
      // This is just a stub to satisfy the interface
    },
  }));

  const toFormattedTableData = (pros: Promotion[]) => {
    return pros
      .slice()
      .reverse()
      .map((pro) => ({
        ...pro,
        startTime: formatPromotionDate(pro.startTime),
        endTime: formatPromotionDate(pro.endTime),
      }));
  };

  return <AdminTable tableColumn={columns} tableData={toFormattedTableData(promotions)} handleViewClick={onView} />;
});
