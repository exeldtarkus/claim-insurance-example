/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import PaginationContainer from "../common/PaginationContainer";
import moment from "moment";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import EllipsisTextWithCopy from "../ui/ellipsis/EllipsisTextWithCopy";
import { IOptions } from "@/interfaces/IOptions";
import DatePicker from "../form/date-picker";

export interface HeadersTable {
  id: string;
  label: string;
  options?: {
    colSpan?: number;
    rowSpan?: number;
    disable?: boolean;
    isPrimaryKey?: boolean;
    isNumber?: boolean;
    isCurrencyFormat?: boolean;
    dateTimeFormat?: string;
    isEllipsisText?: boolean;
    input?: {
       type?: "text" | "number" | "select" | "textarea" | "date";
       optionSelect?: IOptions[]
    }
  };
}

interface BodyTable {
  [key: string]: string | number;
}

interface TableComponentProps {
  title?: string,
  desc?: string,
  tableData: {
    headers: HeadersTable[];
    body?: BodyTable[];
  };
  minWidth?: string;
  isLoading?: boolean;
  isEditable?: boolean;
  tableDataOriginal?: Record<string, string | number>[];
  onBodyChange?: (newBody: Record<string, string | number>[]) => void;
  rowsPerPage?: number;
  pagination?: {
    page: number;
    size: number;
    totalData: number;
    onPageChange: (newPage: number) => void;
    onSizeChange: (newSize: number) => void;
  };
  viewMoreLink?: string; // Optional prop to control the visibility of the "View More" button
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
  onSaveChanges?: () => void; // Callback function for save changes
  isFixingValidation?: boolean; // Optional prop to indicate if fixing validation is enabled
  setFixingValidation?: () => void; // Callback function to set fixing validation state
}

const formatDate = (value: string | number, formatStr: string): string => {
  console.log("formatDate - value", value);
  if (!value) return "";

  const date = moment(value);
  if (!date.isValid()) return value.toString();

  return date.format(formatStr);
};

const formatCurrency = (value: string | number): string => {
  if (typeof value === "string" && !isNaN(Number(value))) {
    value = Number(value);
  }
  if (typeof value === "number") {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }
  return value.toString();
};

const formatNumber = (value: string | number): string => {
  if (typeof value === "string" && !isNaN(Number(value))) {
    value = Number(value);
  }
  if (typeof value === "number") {
    return value.toLocaleString("id-ID");
  }
  return value.toString();
};

const removeUndefined = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const getChangedFields = (
  updatedBody: Record<string, string | number>[] ,
  originalBody: Record<string, string | number>[] ,
  primaryKeys: string[]
): Record<string, string | number>[] => {
  return updatedBody
    .map((row, idx) => {
      const original = originalBody[idx];
      const changes: Record<string, string | number> = {};

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
    .filter((row) => Object.keys(row).some((k) => !primaryKeys.includes(k)));
};

const inputTypeResponse = (
  type: "text" | "number" | "select" | "textarea" | "date",
  commonProps: any,
  optionSelect?: IOptions[]
) => {
  if (type === "textarea") {
    return <textarea {...commonProps} rows={2} />;
  }

  if (type === "number") {
    return <input type="number" {...commonProps} />;
  }

  if (type === "date") {
    return (
      <DatePicker
        id={commonProps.id}
        placeholder="Select Date"
        defaultDate={commonProps.value ? new Date(commonProps.value) : undefined}
        onChange={(selectedDates: Date[]) => {
          const event = {
            target: {
              value: moment(selectedDates[0]).format("YYYY-MM-DD")
            }
          } as ChangeEvent<HTMLInputElement>;
          commonProps.onChange(event);
        }}
      />
    );
  }


  if (type === "select") {
    return (
      <select {...commonProps}>
        <option value="">-- Select --</option>
        {(optionSelect ?? []).map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return <input type="text" {...commonProps} />;
};


const RenderCellValue = (
  itemBody: any,
  tableDataOriginal: any,
  key: string,
  index: number,
  index2: number,
  header: HeadersTable,
  isEditable: boolean,
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, rowIndex: number, key: string) => void
) => {
  const dataIsChange = tableDataOriginal.length > 0 && itemBody[key] !== tableDataOriginal[index]?.[key];
  const usedColoredCells = itemBody["coloredCells"]?.length > 0 && itemBody["coloredCells"]?.some((cell: string) =>
    cell.toLowerCase().includes(key.toLowerCase())
  );
  let result = itemBody[key];


  if ((isEditable && !header.options?.disable) || header.options?.input?.type !== undefined) {
    const inputType = header.options?.input?.type || "text";
    let classNameCustom = `p-2 rounded-md w-full ${dataIsChange ? "bg-yellow-200" : ""}`;

    if (!dataIsChange && usedColoredCells) {
      classNameCustom = "p-2 rounded-md w-full bg-red-400";
    }

    const commonProps = {
      className: classNameCustom,
      name: `input-${key}-${index}-${index2}`,
      id: `input-${key}-${index}-${index2}`,
      value: itemBody[key] ?? "",
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleInputChange(e, index, key),
    };

    return inputTypeResponse(inputType, commonProps);
  }

  if (header.options?.isEllipsisText) {
    return (
      <span>
        <EllipsisTextWithCopy text={itemBody[key]} />
      </span>
    );
  }

  if (header.options?.disable) {
    return <span className="text-gray-500">{itemBody[key]}</span>;
  }

  if (header.options?.isCurrencyFormat && itemBody[key] !== undefined) {
    result = formatCurrency(itemBody[key]);
  }

  if (header.options?.isNumber) {
    result = formatNumber(itemBody[key]);
  }

  if (header.options?.dateTimeFormat && itemBody[key] !== undefined) {
    result = formatDate(itemBody[key], header.options.dateTimeFormat);
  }

  return result;
};

const TableComponent: React.FC<TableComponentProps> = (Props) => {
  const {
    title = "",
    desc = "",
    tableData,
    minWidth = "1102",
    isLoading = false,
    isEditable = false,
    tableDataOriginal = [],
    onBodyChange,
    pagination,
    viewMoreLink = "", // Optional prop to control the visibility of the "View More" button
    isSaveChanges = false, // Optional prop to indicate if save changes is enabled
    onSaveChanges = () => {}, // Callback function for save changes
    isFixingValidation = false, // Optional prop to indicate if fixing validation is enabled
    setFixingValidation,
  } = Props;

  const router = useRouter();
  const [editableBody, setEditableBody] = useState<BodyTable[]>(tableData.body || []);
  const [currentPage, setCurrentPage] = useState(pagination?.page ?? 1);
  const [pageSize, setPageSize] = useState(pagination?.size ?? 10);

  const primaryKeys = tableData.headers
    .filter((h) => h.options?.isPrimaryKey)
    .map((h) => h.id);

  const totalRows = pagination?.totalData ?? 0;
  const totalPages = Math.ceil(totalRows / pageSize);

  useEffect(() => {
    setEditableBody(tableData.body || []);
  }, [tableData.body]);

  const currentData = editableBody;

  if (isEditable) {
    if (tableDataOriginal.length <= 0) {
      throw new Error("Table origin data must be define!");
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      onBodyChange(changedFields);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (pagination) {
        pagination.onPageChange(page);
      }
    }
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (pagination) {
      pagination.onSizeChange(size);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        <div role="status" className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  const handleRedirectPage = (link: string) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-4">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        <div className="px-6 py-5 flex items-center space-x-2">

          {isSaveChanges && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSaveChanges}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
            >
              Apply All
            </Button>
          )}
          {isFixingValidation && (
            <Button
              size="sm"
              variant="outline"
              onClick={setFixingValidation}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
            >
              Fixing Validation
            </Button>
          )}
          {viewMoreLink != "" && (
            <Button size="sm" variant="outline" onClick={() => handleRedirectPage(viewMoreLink)} className="ml-4 mt-2 sm:mt-0">
              View More
            </Button>
          )}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className={`min-w-[${minWidth}px]`}>
          <Table>
            <TableHeader className="border-b border-gray-100 bg-gray-100 dark:bg-gray-700 dark:border-white/[0.05]">
              <TableRow key={`header-row-0`}>
                {
                  tableData.headers.length > 0 &&
                    tableData.headers.map((header, index) => (
                      <TableCell
                        isHeader
                        key={`header-cell-${index}`}
                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 whitespace-nowrap"
                        colSpan={header?.options?.colSpan}
                        rowSpan={header?.options?.rowSpan}
                      >
                        {header.label}
                      </TableCell>
                    ))
                }
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {
                currentData && currentData.length > 0 ? (
                  currentData.map((itemBody, index) => {
                    return (
                      <TableRow
                        key={`body-row-${index}`}
                      >
                        {tableData.headers.map((header, index2) => {
                          const key = header.id;
                          return (
                            <TableCell
                              key={`body-cell-${index}-${index2}`}
                              className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                            >
                              {
                                RenderCellValue(
                                  itemBody,
                                  tableDataOriginal,
                                  key,
                                  index,
                                  index2,
                                  header,
                                  isEditable,
                                  handleInputChange
                                )
                              }
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      className="px-5 py-4 sm:px-6 text-center text-gray-500"
                      colSpan={tableData.headers.length || 1}
                    >
                      Data Not Found
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>

        </div>
        {/* Pagination Container */}
      </div>
      { pagination && (
        <div className="pt-4">
          <PaginationContainer
            isLoading={isLoading}
            pagination={{
              page: currentPage,
              size: pageSize,
              totalPages: totalPages,
              totalData: totalRows,
              onPageChange: handlePageChange,
              onSizeChange: handleSizeChange,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
