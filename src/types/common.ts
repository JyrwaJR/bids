import React from 'react';
export type Props = {
  children: React.ReactNode;
};

export type ColumnSizingInfo = {
  startOffset: number | null;
  startSize: number | null;
  deltaOffset: number | null;
  deltaPercentage: number | null;
  isResizingColumn: boolean;
  columnSizingStart: any[]; // Use a more specific type if possible
};

export type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export type ColumnState = {
  columnSizing: Record<string, any>; // Use a more specific type if possible
  columnSizingInfo: ColumnSizingInfo;
  rowSelection: Record<string, any>; // Use a more specific type if possible
  expanded: Record<string, any>; // Use a more specific type if possible
  grouping: any[]; // Use a more specific type if possible
  sorting: any[]; // Use a more specific type if possible
  columnFilters: any[]; // Use a more specific type if possible
  columnPinning: {
    left: any[]; // Use a more specific type if possible
    right: any[]; // Use a more specific type if possible
  };
  rowPinning: {
    top: any[]; // Use a more specific type if possible
    bottom: any[]; // Use a more specific type if possible
  };
  columnOrder: any[]; // Use a more specific type if possible
  columnVisibility: Record<string, any>; // Use a more specific type if possible
  pagination: Pagination;
};

export type Column = {
  id: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  accessorKey?: string;
  header?: string;
};

export type Options = {
  filterFromLeafRows: boolean;
  maxLeafRowFilterDepth: number;
  globalFilterFn: string;
  groupedColumnMode: string;
  paginateExpandedRows: boolean;
  enableRowSelection: boolean;
  enableMultiRowSelection: boolean;
  enableSubRowSelection: boolean;
  columnResizeMode: string;
  state: ColumnState;
  renderFallbackValue: any; // Use a more specific type if possible
  columns: Column[];
};

export type Table = {
  _features: Record<string, any>[]; // Use a more specific type if possible
  options: Options;
  initialState: ColumnState;
};
