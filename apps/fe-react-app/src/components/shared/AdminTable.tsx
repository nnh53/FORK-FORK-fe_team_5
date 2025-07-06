import { Button } from "@/components/Shadcn/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { Edit, Eye, Trash } from "lucide-react";

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
interface AdminTableProps<T extends { id?: number; [key: string]: unknown }> {
  tableColumn: (TableColumns & { sortProps?: SortProps })[];
  tableData: T[];
  handleViewClick?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDeleteClick?: (id: number) => void;
}

export const AdminTable = <T extends { id?: number; [key: string]: unknown }>({
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
              <TableHead key={column.header} className={`h-auto whitespace-normal break-words text-center ${column.width ?? ""}`}>
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
                <TableCell key={`${column.accessorKey}_${data.id ?? index}`} className="whitespace-pre-wrap break-words text-center">
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
                <div className="flex justify-center space-x-2">
                  {data.id !== undefined && handleViewClick && (
                    <Button variant="outline" size="icon" onClick={() => handleViewClick(data.id!)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {data.id !== undefined && handleEdit && (
                    <Button variant="outline" size="icon" onClick={() => handleEdit(data.id!)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {data.id !== undefined && handleDeleteClick && (
                    <Button variant="outline" size="icon" onClick={() => handleDeleteClick(data.id!)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
