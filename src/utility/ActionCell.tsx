import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { TfiMore } from "react-icons/tfi";

interface ActionCellProps {
  rowId: number;
  rowItem?: object;
  onGrade?: (id: number) => void; // ✅ optional
  toggleAction?: () => void;
  onDownloadAttached?: () => void;
  canView: boolean
  disabled?: boolean
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowId,
  toggleAction = () => null,
  onGrade,
  onDownloadAttached,
  canView = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex justify-center items-center" ref={dropdownRef}>
      <TfiMore
        size={20}
        className="cursor-pointer rotate-90 text-primary"
        onClick={() => {
          setOpen(!open);
          toggleAction?.();
        }}
      />

      {open && (
        <div className="absolute top-6 right-0 flex flex-col bg-white rounded shadow-md z-50">
          {(canView || onGrade) && (
            <button
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 border-b border-gray-200"
              onClick={() => onGrade?.(rowId)}
              disabled={disabled}
            >
              <FaStar /> Grade
            </button>
          )}
          {onDownloadAttached && (
            <button
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 border-b border-gray-200"
              onClick={onDownloadAttached}
              disabled={disabled}
            >
              <FaDownload /> Download
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionCell;
