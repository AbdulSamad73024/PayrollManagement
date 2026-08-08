import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Pagination } from './Pagination';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import './DataTable.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string | number);
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  isLoading = false,
  error = null,
  emptyMessage = 'No records found matching your query.',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getRowKey = (row: T): string | number => {
    if (typeof keyField === 'function') return keyField(row);
    return row[keyField];
  };

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDirection]);

  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allKeys = paginatedData.map(getRowKey);
      onSelectionChange(Array.from(new Set([...selectedIds, ...allKeys])));
    } else {
      const currentPageKeys = new Set(paginatedData.map(getRowKey));
      onSelectionChange(selectedIds.filter(id => !currentPageKeys.has(id)));
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(key)) {
      onSelectionChange(selectedIds.filter(id => id !== key));
    } else {
      onSelectionChange([...selectedIds, key]);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading records..." />;
  }

  if (error) {
    return <ErrorMessage title="Failed to Load Data" message={error} />;
  }

  const isAllCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every(row => selectedIds.includes(getRowKey(row)));

  return (
    <div className="datatable-container">
      <div className="datatable-scroll">
        <table className="datatable-main">
          <thead>
            <tr>
              {selectable && (
                <th className="datatable-th datatable-th--checkbox">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={handleSelectAll}
                    className="datatable-checkbox"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`datatable-th datatable-th--${col.align || 'left'} ${
                    col.sortable ? 'datatable-th--sortable' : ''
                  }`}
                  onClick={() => handleSort(col.key, col.sortable)}
                >
                  <div className="datatable-th-content">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="datatable-sort-icon">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="datatable-empty-td"
                >
                  <div className="datatable-empty-wrapper">
                    <p className="datatable-empty-text">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rKey = getRowKey(row);
                const isSelected = selectedIds.includes(rKey);
                return (
                  <tr
                    key={rKey}
                    className={`datatable-tr ${isSelected ? 'datatable-tr--selected' : ''}`}
                  >
                    {selectable && (
                      <td className="datatable-td datatable-td--checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rKey)}
                          className="datatable-checkbox"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`datatable-td datatable-td--${col.align || 'left'}`}
                      >
                        {col.render ? col.render(row) : row[col.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalRecords > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={itemsPerPage}
          totalRecords={totalRecords}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
