/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import EllipsisTextWithCopy from "../ui/ellipsis/EllipsisTextWithCopy";

interface HeadersTable {
  id: string;
  label : string;
  colSpan? : number;
  rowSpan? : number;
}

interface BodyTable {
  [key: string]: string;
}

interface TableDynamicProps {
  tableData: {
    headers: HeadersTable[];
    body?: BodyTable[];
  }; // Cell content
  minWidth?: string;
  isLoading?: boolean;
  isEditable?: boolean; // Optional prop to indicate if the table is editable
  tableDataOriginal?: Record<string, string>[];
  onBodyChange?: (newBody: Record<string, string>[]) => void; // Add this
  disableFieldsInput?: string[];
  primaryKeys?: string[];
  returnOnlyEditedValue?: boolean;
}

const notChangeFormatNumber = [
  "nomorCifDebitur",
  "nomorRekeningFasilitas",
  "nomorIdentitas",
];
const bodyTableWidthCustom = [
  "validasiDeskripsi",
  "alamatTempatBekerja",
];
const disableFieldInput = [
  "validasiDeskripsi",
  "nomorCifDebitur",
];

const removeUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const getChangedFields = (
  updatedBody: Record<string, string>[],
  originalBody: Record<string, string>[],
  primaryKeys: string[],
): Record<string, string>[] => {
  return updatedBody
    .map((row, idx) => {
      const original = originalBody[idx];
      const changes: Record<string, string> = {};

      Object.keys(row).forEach((key) => {
        if (row[key] !== original?.[key]) {
          changes[key] = row[key];
        }
      });

      primaryKeys.forEach((pk) => {
        if (original?.[pk]) {
          changes[pk] = original[pk];
        }
      });

      return removeUndefined(changes);
    })
    .filter(row => Object.keys(row).some(k => !primaryKeys.includes(k)));
};


// Helper function to format numbers
const formatNumber = (value: string | number): string => {
  if (typeof value === "string" && !isNaN(Number(value))) {
    value = Number(value); // Convert to number
  }
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID").format(value); // Format as Indonesian locale
  }
  return value; // Return as-is if not a number
};

const TableDynamic: React.FC<TableDynamicProps> = (Props) => {

  const {
    tableData,
    minWidth = "1102",
    isLoading = false,
    isEditable = false,
    tableDataOriginal = [],
    onBodyChange,
    disableFieldsInput = [],
    primaryKeys = [],
    returnOnlyEditedValue = false
  } = Props;

  // Local state for editable body if needed
  const [editableBody, setEditableBody] = useState<BodyTable[]>(tableData.body || []);

  if (disableFieldInput.length > 0) {
    disableFieldInput.push(...disableFieldsInput);
  }

  // useEffect(() => {
  //   setEditableBody(tableData.body || []);
  // }, [tableData.body]);

  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    key: string
  ) => {
    const newValue = e.target.value;

    const updatedBody = editableBody.map((row, idx) =>
      idx === rowIndex ? { ...row, [key]: newValue } : row
    );

    setEditableBody(updatedBody);

    const changedFields = getChangedFields(updatedBody, tableDataOriginal, primaryKeys);

    if (onBodyChange) {
      onBodyChange(returnOnlyEditedValue === true ? changedFields : updatedBody);
    }
  };

  if (isLoading) {
    return (
      <div role="status" className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-[20px] dark:bg-gray-700 mb-2.5"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className={`min-w-[${minWidth}px]`}>
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 bg-gray-100 dark:bg-gray-700  dark:border-white/[0.05]">
              <TableRow key={`header-row-0`}>
                {
                  tableData.headers.length > 0 &&
                    tableData.headers.map((header, index) => (
                      <TableCell
                        isHeader
                        key={`header-cell-${index}`}
                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                        colSpan={header.colSpan}
                        rowSpan={header.rowSpan}
                      >
                        {header.label}
                      </TableCell>
                    ))
                }
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {editableBody && editableBody.length > 0 ? (
                editableBody.map((itemBody, index) => (
                  <TableRow key={`body-row-${index}`}>
                    {Object.keys(itemBody).map((key, index2) => {
                      const dataIsChange = (tableDataOriginal.length > 0 && itemBody[key] !== tableDataOriginal[index]?.[key]);
                      return (
                        <TableCell
                          key={`body-cell-${index}-${index2}`}
                          className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                        >
                          <div
                            className={
                              bodyTableWidthCustom.includes(key)
                                ? "w-[30rem] max-w-full overflow-x-auto"
                                : "max-w-full overflow-x-auto"
                            }
                          >
                            {isEditable && (
                              disableFieldInput.includes(key) || primaryKeys.includes(key) ? (
                                <span>
                                  <EllipsisTextWithCopy text={itemBody[key]} />
                                </span>
                              ) : (
                                <input
                                  type="text"
                                  className={`p-2 rounded-md ${
                                    dataIsChange
                                      ? "bg-yellow-200"
                                      : ""
                                  }`}
                                  name={`input-${key}-${index}-${index2}`}
                                  id={`input-${key}-${index}-${index2}`}
                                  value={itemBody[key]?? ""}
                                  onChange={(e) => handleInputChange(e, index, key)}
                                />
                              )
                            )}
                            {!isEditable &&
                            (notChangeFormatNumber.includes(key)
                              ? itemBody[key]
                              : formatNumber(itemBody[key]))}
                          </div>
                        </TableCell>
                      );})}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="px-5 py-4 sm:px-6 text-center text-gray-500"
                    colSpan={tableData.headers.length || 1}
                  >
                    Data Not Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableDynamic;
