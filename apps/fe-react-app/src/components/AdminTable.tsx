/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/Shadcn/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import type { TableColumns } from "./Table";

interface AdminTableProps<T extends object> {
  tableColumn: TableColumns[];
  tableData: T[];
  handleViewClick?: (id: number) => void;
  handleEdit?: (id: number) => void;
  handleDeleteClick?: (id: number) => void;
}

export const AdminTable = <T extends object>({ tableColumn, tableData, handleViewClick, handleEdit, handleDeleteClick }: AdminTableProps<T>) => {
  const colorPicker = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 uppercase";
      case "inactive":
        return "bg-red-100 text-red-800 uppercase";
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumn &&
                tableColumn.map((column) => (
                  <TableHead key={column.header} className={`h-auto whitespace-normal break-words ${column.width ? column.width : ""}`}>
                    {column.header}
                  </TableHead>
                ))}
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData &&
              tableData.map((data, index) => {
                return (
                  <TableRow key={`row_${(data as any).id ?? index}`}>
                    {tableColumn.map((column) =>
                      column.accessorKey === "status" ? (
                        <TableCell
                          key={`${column.accessorKey}_${(data as any).id ?? index}`}
                          className={`font-medium text-base-content whitespace-pre-wrap break-words `}
                        >
                          <span className={`px-2 py-1 rounded text-xs font-medium ${colorPicker((data as any)[column.accessorKey])}`}>
                            {(data as any)[column.accessorKey]}
                          </span>
                        </TableCell>
                      ) : (
                        <TableCell key={`${column.accessorKey}_${(data as any).id ?? index}`} className=" whitespace-pre-wrap break-words">
                          {(data as any)[column.accessorKey]}
                        </TableCell>
                      ),
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => (handleViewClick ? handleViewClick((data as any).id) : undefined)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => (handleEdit ? handleEdit((data as any).id) : undefined)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => (handleDeleteClick ? handleDeleteClick((data as any).id) : undefined)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
