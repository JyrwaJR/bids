import React from 'react';
import { Checkbox } from './ui/checkbox';

type SelectCheckboxProps = {
  table?: any;
  row?: any;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  isHeader?: boolean;
};

export const SelectCheckbox: React.FC<SelectCheckboxProps> = ({
  table,
  row,
  selectedIds,
  setSelectedIds,
  isHeader = false
}) => {
  const handleCheckedChange = (value: boolean) => {
    if (isHeader && table) {
      table.toggleAllPageRowsSelected(!!value);
      const rows = table.getRowModel().rows;
      if (value) {
        setSelectedIds(rows.map((r: any) => r.original.id));
      } else {
        setSelectedIds([]);
      }
    } else if (row) {
      if (row && row.original) {
        const rowId = row.original.id;
        if (rowId) {
          if (value) {
            row.getToggleSelectedHandler()(!!value);
            setSelectedIds([...selectedIds, rowId]);
          } else {
            row.getToggleSelectedHandler()(!!value);
            setSelectedIds(selectedIds.filter((id) => id !== rowId));
          }
        }
      }
    }
  };

  const isChecked = isHeader
    ? table?.getIsAllPageRowsSelected() || false
    : row?.getIsSelected() || selectedIds.includes(row.original.id);
  return (
    <Checkbox
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      aria-label={isHeader ? 'Select all' : 'Select row'}
    />
  );
};
