import { Badge } from "@/components/Shadcn/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { AdminTable } from "@/components/shared/AdminTable";
import type { TableColumns } from "@/components/shared/CustomTable";
import { usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import type { Promotion } from "@/interfaces/promotion.interface";
import {
  formatPromotionDate,
  getPromotionStatusLabel,
  getPromotionTypeLabel,
  isValidPromotionStatus,
  isValidPromotionType,
} from "@/services/promotionService";
import { Image } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle, useMemo } from "react";

interface PromotionTableProps {
  promotions: Promotion[];
  columns: TableColumns[];
  onView: (id?: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// Helper function to customize how data is displayed in the table
const formatPromotionData = (promotions: Promotion[]) => {
  return promotions
    .slice()
    .reverse()
    .map((pro) => {
      // Process the image field
      const imageElement = pro.image ? (
        <img src={pro.image} alt={pro.title} className="h-14 w-14 rounded object-cover" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded bg-gray-200">
          <Image className="h-6 w-6 text-gray-400" />
        </div>
      );

      // Process the type field
      const typeText = isValidPromotionType(pro.type) ? getPromotionTypeLabel(pro.type as "PERCENTAGE" | "AMOUNT") : "Loại không hợp lệ";
      const typeClass = pro.type === "PERCENTAGE" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
      const typeDisplay = (
        <Badge variant="outline" className={typeClass}>
          {typeText}
        </Badge>
      );

      // Process the discount value
      const discountDisplay = pro.type === "PERCENTAGE" ? `${pro.discountValue}%` : `${pro.discountValue.toLocaleString()} VNĐ`;

      // Process the min purchase
      const minPurchaseDisplay = `${pro.minPurchase.toLocaleString()} VNĐ`;

      // Process the description (truncate if too long)
      const descriptionDisplay = pro.description.length > 50 ? `${pro.description.substring(0, 50)}...` : pro.description;

      // Process the status
      const statusText = isValidPromotionStatus(pro.status)
        ? getPromotionStatusLabel(pro.status as "ACTIVE" | "INACTIVE")
        : "Trạng thái không hợp lệ";
      const statusClass = pro.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
      const statusDisplay = <Badge className={statusClass}>{statusText}</Badge>;

      return {
        ...pro,
        startTime: formatPromotionDate(pro.startTime),
        endTime: formatPromotionDate(pro.endTime),
        image: imageElement,
        type: typeDisplay,
        discountValue: discountDisplay,
        minPurchase: minPurchaseDisplay,
        description: descriptionDisplay,
        status: statusDisplay,
      };
    });
};

export const PromotionTable = forwardRef<{ resetPagination: () => void }, PromotionTableProps>(
  ({ promotions, columns, onView, onEdit, onDelete }, ref) => {
    // Use sortable hook to manage sorted data
    const { sortedData, getSortProps } = useSortable<Promotion>(promotions);

    // Pagination configuration
    const pagination = usePagination({
      totalCount: sortedData.length,
      pageSize: 10,
      maxVisiblePages: 5,
      initialPage: 1,
    });

    // Expose resetPagination method to parent component
    useImperativeHandle(ref, () => ({
      resetPagination: () => pagination.setPage(1),
    }));

    // Format and prepare the promotion data for display
    const formattedData = useCallback(() => formatPromotionData(sortedData), [sortedData]);

    // Get current page data
    const currentPageData = useMemo(() => {
      return formattedData().slice(pagination.startIndex, pagination.endIndex + 1);
    }, [formattedData, pagination.startIndex, pagination.endIndex]);

    // Modify columns to include sort buttons
    const columnsWithSorting = useMemo(() => {
      return columns.map((column) => {
        // Skip adding sort buttons to non-sortable columns or columns that don't represent data fields
        if (
          column.accessorKey === "image" ||
          column.accessorKey === "description" ||
          column.accessorKey === "type" ||
          column.accessorKey === "status"
        ) {
          return column;
        }

        // Convert column name to proper field name for sorting
        const fieldKey = column.accessorKey as keyof Promotion;

        // Add sortProps to the column
        return {
          ...column,
          sortProps: getSortProps(fieldKey),
        };
      });
    }, [columns, getSortProps]);

    return (
      <div className="space-y-4">
        <div className="w-full overflow-hidden rounded-md border">
          <AdminTable
            tableColumn={columnsWithSorting}
            tableData={currentPageData}
            handleViewClick={onView}
            handleEdit={onEdit}
            handleDeleteClick={onDelete}
          />
        </div>
        {/* Pagination */}
        {sortedData.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.prevPage()}
                  className={`cursor-pointer ${pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>

              {pagination.visiblePages.map((page, i) => {
                if (page === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => pagination.setPage(page)} isActive={page === pagination.currentPage} className="cursor-pointer">
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.nextPage()}
                  className={`cursor-pointer ${pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  },
);

PromotionTable.displayName = "PromotionTable";
