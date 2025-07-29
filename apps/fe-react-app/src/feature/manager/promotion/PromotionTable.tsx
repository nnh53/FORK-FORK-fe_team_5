import { Badge } from "@/components/Shadcn/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationJump,
  PaginationLast,
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
import { formatVND } from "@/utils/currency.utils";
import { Image } from "lucide-react";
import { forwardRef, useCallback, useImperativeHandle } from "react";

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
      const discountDisplay = pro.type === "PERCENTAGE" ? `${pro.discountValue}%` : formatVND(pro.discountValue);

      // Process the min purchase
      const minPurchaseDisplay = formatVND(pro.minPurchase);

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
    const currentPageData = formattedData()
      .slice(pagination.startIndex, pagination.endIndex + 1)
      .reverse();

    // Modify columns to include sort buttons
    const columnsWithSorting = columns.map((column) => {
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
          <div className="flex items-center gap-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationFirst
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.setPage(1);
                    }}
                    className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.prevPage();
                    }}
                    className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {pagination.visiblePages.map((page, i) => {
                  if (page === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-page-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.setPage(page);
                        }}
                        isActive={page === pagination.currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.nextPage();
                    }}
                    className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.setPage(pagination.totalPages);
                    }}
                    className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <PaginationJump currentPage={pagination.currentPage} totalPages={pagination.totalPages} onJump={(page) => pagination.setPage(page)} />
          </div>
        )}
      </div>
    );
  },
);

PromotionTable.displayName = "PromotionTable";
