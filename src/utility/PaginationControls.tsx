import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiSkipLeftLine, RiSkipRightLine } from "react-icons/ri";
import type { PaginationControlProps } from "../lib/interfaces";

const PaginationControls: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  totalItems,
  setCurrentPage,
  itemsPerPage,
  tableType,
}) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center gap-6 text-xs">
      <div className="text-tetiary/50 font-medium">
        Showing &nbsp;
        <span className="text-tetiary">{start} - {end} of {totalItems}</span>
        &nbsp; {tableType}
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2.5 rounded-md bg-tetiary/5 border border-tetiary/10 disabled:opacity-25"
        >
          Previous
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2.5 rounded-md bg-tetiary/5 border border-tetiary/10 disabled:opacity-25"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
