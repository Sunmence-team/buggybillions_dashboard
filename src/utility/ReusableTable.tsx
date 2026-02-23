import React from "react";
import PaginationControls from "./PaginationControls";
import type { ReusableTableProps, TableColumnProps } from "../lib/interfaces";
import { LuLoaderCircle } from "react-icons/lu";

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalItems,
  setCurrentPage,
  hasSerialNo = true,
}) => {
  const itemsPerPage = 10;

  const columnsWithSN: TableColumnProps[] = [
    ...(hasSerialNo
      ? [
        {
          title: "S/N",
          key: "sn",
          render: (_: any, index: number) => {
            const serial = (currentPage - 1) * itemsPerPage + index + 1;
            return serial.toString().padStart(3, "0");
          },
          className: "p-4 text-sm whitespace-nowrap font-medium",
        },
      ]
      : []),

    ...columns,
  ];

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto no-scrollbar  w-full lg:p-0 pe-4">
        <table className="w-full min-w-200 text-center bg-white mb-2">
          <thead>
            <tr className="bg-[#ECFFFC] h-12.5 rounded-xl">
              {columnsWithSN.map((col, idx) => (
                <th
                  key={col.key ?? idx}
                  className="p-4 text-sm font-medium text-black/60 whitespace-nowrap"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="h-12.5 border-y border-black/15">
                <td colSpan={columnsWithSN.length}>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <LuLoaderCircle className="animate-spin" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr className={`h-12.5 border-y border-black/15`}>
                <td colSpan={columnsWithSN.length}>
                  {typeof error === "string"
                    ? error
                    : error.message || "An error occurred"}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className={`h-12.5 border-y border-black/15`}>
                <td colSpan={columnsWithSN.length} className="p-3 text-sm">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`h-12.5 border-y border-black/15`}
                >
                  {columnsWithSN.map((col, idx) => (
                    <td
                      key={col.key ?? idx}
                      className={
                        col.className ||
                        "p-3 text-sm whitespace-nowrap text-black font-medium"
                      }
                    >
                      {col.render
                        ? col.render(item, index)
                        : col.key
                          ? item[col.key as keyof typeof item]
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!isLoading && !error && data.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ReusableTable;
