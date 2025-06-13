import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

export interface TableColumns {
  header: string;
  accessorKey: string;
  width?: string;
}

interface CustomTableProps<T extends object> {
  tableColumns: TableColumns[];
  tableData: T[];
}
export const CustomTable = <T extends object>({ tableColumns, tableData }: CustomTableProps<T>) => {
  return (
    <>
      <div className="overflow-x-auto">
        <Table className="table table-zebra table-fixed w-full">
          {/* <!-- Table Head --> */}
          <TableHeader>
            <tr className="text-lg text-neutral-600 uppercase">
              {tableColumns &&
                tableColumns.map((column) => (
                  <th className={`h-auto whitespace-normal border border-base-300 ${column.width ? column.width : ""}`}>{column.header}</th>
                ))}
            </tr>
          </TableHeader>
          {/* <!-- Table Body --> */}
          <TableBody>
            {tableData &&
              tableData.map((data, index) => {
                return (
                  <>
                    <TableRow key={`${index}`}>
                      {Object.entries(data).map(([key, value]) => {
                        return (
                          <TableCell key={`${key}_${index}`} className="font-medium text-base-content border border-base-300">
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
