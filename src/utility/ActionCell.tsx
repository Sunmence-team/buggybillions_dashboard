import React, { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { TfiMore } from "react-icons/tfi";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

interface ActionCellProps {
  rowId: number;
  rowItem?: object;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  canView?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowId,
  onEdit,
  onDelete,
  onView,
  canView = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    strategy: "fixed",
    middleware: [
      offset(6),
      flip({ fallbackPlacements: ["top-end", "bottom-end"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const isFloatingReady = Boolean(refs.floating.current);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const referenceEl = refs.reference.current as HTMLElement | null;
      const floatingEl = refs.floating.current as HTMLElement | null;
      const target = event.target as Node;

      if (
        referenceEl &&
        !referenceEl.contains(target) &&
        floatingEl &&
        !floatingEl.contains(target)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, refs]);

  return (
    <div className="flex justify-center items-center" ref={dropdownRef}>
      {/* Trigger */}
      <div
        ref={refs.setReference}
        className={`hover:bg-primary/10 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ${
          open ? "bg-primary/20" : ""
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <TfiMore size={20} className="rotate-90 text-primary" />
      </div>

      {/* Dropdown */}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 9999,
              visibility: open && isFloatingReady ? "visible" : "hidden",
              transition: "none",
            }}
            className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 min-w-32 text-sm overflow-hidden"
          >
            {(canView || onView) && (
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onView?.(rowId);
                  setOpen(false);
                }}
              >
                <FaEye /> View
              </button>
            )}

            {onEdit && (
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onEdit(rowId);
                  setOpen(false);
                }}
              >
                <FiEdit /> Edit
              </button>
            )}

            {onDelete && (
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 border-t border-gray-50"
                onClick={() => {
                  onDelete(rowId);
                  setOpen(false);
                }}
              >
                <FiTrash2 /> Delete
              </button>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default ActionCell;