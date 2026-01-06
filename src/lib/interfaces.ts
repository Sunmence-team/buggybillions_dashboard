import React from "react";

export interface OverviewCardsProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  buttonText?: string;
  path?: string;
}
export interface StatusCardProps {
  type: "low" | "medium" | "high";
}

export interface ActivityCardProps {
  title: string;
  description: string;
  createdDate: string;
}
export interface TableColumnProps {
  title: string | React.ReactNode;
  key?: string;
  render?: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export interface ReusableTableProps extends PaginationControlProps {
  columns: TableColumnProps[];
  isLoading: boolean;
  data: any[];
  error: any;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  isDeleting?: boolean;
  hasSerialNo?: boolean;
}

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  tableType?: string;
}

export interface TasksProps {
  id?: string;
  task_name: string;
  assignee: string;
  due_date: string;
  priority: "low" | "medium" | "high";
}