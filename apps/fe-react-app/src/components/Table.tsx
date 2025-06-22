/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";

export interface TableColumns {
  header: string;
  accessorKey: string;
  width?: string;
}

interface CustomTableProps<T extends object> {
  tableColumns: TableColumns[];
  tableData: T[];
  action?: (entry: number) => void;
}
export const CustomTable = <T extends object>({ tableColumns, tableData, action }: CustomTableProps<T>) => {
  return (
    <>
      <div className="overflow-x-auto">
        <Table className="table table-zebra table-fixed w-full">
          {/* <!-- Table Head --> */}
          <TableHeader>
            <TableRow className="text-lg text-neutral-600 uppercase">
              {tableColumns &&
                tableColumns.map((column) => (
                  <TableHead
                    key={column.header}
                    className={`h-auto whitespace-normal break-words border border-base-300 ${column.width ? column.width : ""}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          {/* <!-- Table Body --> */}
          {tableData.length > 0 && (
            <TableBody>
              {tableData.map((data, index) => {
                return (
                  <TableRow key={`row_${(data as any).id ?? index}`}>
                    {tableColumns.map((column) => (
                      <TableCell
                        key={`${column.accessorKey}_${(data as any).id ?? index}`}
                        onClick={
                          action && (data as any).id
                            ? () => {
                                action((data as any).id);
                              }
                            : undefined
                        }
                        className="font-medium text-base-content border border-base-300 whitespace-pre-wrap break-words"
                      >
                        {(data as any)[column.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        {tableData.length == 0 && <h1 className="text-red-400"> Không có dữ liệu</h1>}
      </div>
    </>
  );
};
