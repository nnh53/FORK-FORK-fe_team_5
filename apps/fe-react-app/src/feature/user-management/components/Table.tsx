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
        <table className="table table-zebra table-fixed w-full">
          {/* <!-- Table Head --> */}
          <thead>
            <tr className="text-lg text-neutral-600 uppercase">
              {tableColumns &&
                tableColumns.map((column) => (
                  <th className={`h-auto whitespace-normal border border-base-300 ${column.width ? column.width : ""}`}>{column.header}</th>
                ))}
            </tr>
          </thead>
          {/* <!-- Table Body --> */}
          <tbody>
            {tableData &&
              tableData.map((data, index) => {
                return (
                  <>
                    <tr key={`${index}`}>
                      {Object.entries(data).map(([key, value]) => {
                        return (
                          <td key={`${key}_${index}`} className="font-medium text-base-content border border-base-300">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};
