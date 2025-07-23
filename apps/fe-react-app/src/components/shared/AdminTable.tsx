import { Button } from "@/components/Shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

type SortProps = {
  direction: "asc" | "desc" | "none";
  onChange: (direction: "asc" | "desc" | "none") => void;
};

interface TableColumns {
  header: string;
  accessorKey: string;
  width?: string;
  sortProps?: SortProps;
}

// Use a more permissive type for T to allow string indexing
interface AdminTableProps<T extends { id: number; [key: string]: unknown }> {
  tableColumn: (TableColumns & { sortProps?: SortProps })[];
  tableData: T[];
  handleViewClick?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDeleteClick?: (id: number) => void;
}

export const AdminTable = <T extends { id: number; [key: string]: unknown }>({
  tableColumn,
  tableData,
  handleViewClick,
  handleEdit,
  handleDeleteClick,
}: AdminTableProps<T>) => {
  const colorPicker = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 uppercase";
      case "inactive":
        return "bg-red-100 text-red-800 uppercase";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {tableColumn.map((column) => (
              <TableHead key={column.header} className={`h-auto text-center break-words whitespace-normal ${column.width ?? ""}`}>
                {column.sortProps ? (
                  <div className="flex items-center justify-center">
                    <SortButton variant="ghost" {...column.sortProps} label={column.header} className="px-2" />
                  </div>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
            <TableHead className="w-24 text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow key={`row_${data.id ?? index}`}>
              {tableColumn.map((column) => (
                <TableCell key={`${column.accessorKey}_${data.id ?? index}`} className="text-center break-words whitespace-pre-wrap">
                  {column.accessorKey === "status" ? (
                    <span className={`rounded px-2 py-1 text-xs font-medium ${colorPicker(data[column.accessorKey] as string)}`}>
                      {data[column.accessorKey] as string}
                    </span>
                  ) : (
                    (data[column.accessorKey] as string | number)
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center">
                {data.id !== undefined && (handleViewClick || handleEdit || handleDeleteClick) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {handleViewClick && (
                        <DropdownMenuItem onClick={() => handleViewClick(data.id!)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                      )}
                      {handleEdit && (
                        <DropdownMenuItem onClick={() => handleEdit(data.id!)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                      )}
                      {handleDeleteClick && (
                        <DropdownMenuItem onClick={() => handleDeleteClick(data.id!)} className="cursor-pointer text-red-600 focus:text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
