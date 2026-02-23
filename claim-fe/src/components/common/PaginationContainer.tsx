// import useIsMobile from "@/hooks/useIsMobile";
import React, { useEffect, useRef, useState } from "react";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

interface PaginationContainerProps {
  isLoading?: boolean;
  pagination: {
    page: number; // Current page number
    size: number; // Number of items per page
    totalPages: number; // Total number of pages
    totalData: number; // Total number of data items
    onPageChange: (page: number) => void; // Callback function to change page
    onSizeChange: (page: number) => void; // Callback function to change page
  }
}

const PaginationContainer: React.FC<PaginationContainerProps> = ({isLoading = false, pagination}) => {

  // const isMobile = useIsMobile();
  const [inputPage, setInputPage] = useState(pagination.page);
  const inputTimeout = useRef<NodeJS.Timeout | null>(null);
  const optionsSize = [5, 10, 20, 50].map(size => ({
    label: `${size} items`,
    value: size.toString(),
  }));

  useEffect(() => {
    setInputPage(pagination.page);
  }, [pagination.page]);

  const handleChangePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    pagination.onPageChange(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputPage(value);

    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
    }

    inputTimeout.current = setTimeout(() => {
      const page = Math.max(1, Math.min(pagination.totalPages, value));
      if (page !== pagination.page) {
        handleChangePage(page);
      }
    }, 1500); // 1 minute = 60000 ms
  };

  const handleChangeSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {value} = e.target as HTMLSelectElement;
    const size = Number(value);
    if (size !== pagination.size) {
      pagination.onPageChange(1);
      pagination.onSizeChange(value ? Number(value) : 5);
    }
  };

  return !isLoading && (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 text-gray-500 text-theme-xs sm:px-6 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 ">
      <div className="flex flex-1 justify-between items-center 2xl:hidden">
        <span
          role="button"
          onClick={() => pagination.page > 1 && pagination.onPageChange(pagination.page - 1)}
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 dark:ring-gray-800 ${
            pagination.page <= 1
              ? "text-gray-300 dark:text-white/40 cursor-not-allowed bg-gray-100 dark:bg-white/[0.01]"
              : "text-gray-400 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-white/[0.06]"
          }`}
          aria-disabled={pagination.page <= 1}
        >
          Previous
        </span>
        <span>
          {(pagination.page - 1) * pagination.size + 1} - {Math.min(pagination.page * pagination.size, pagination.totalData)} of {pagination?.totalData ?? "-"} rows
        </span>
        <span
          role="button"
          onClick={() => pagination.page < pagination.totalPages && pagination.onPageChange(pagination.page + 1)}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 dark:ring-gray-800 ${
            pagination.page >= pagination.totalPages
              ? "text-gray-300 dark:text-white/40 cursor-not-allowed bg-gray-100 dark:bg-white/[0.01]"
              : "text-gray-400 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-white/[0.06]"
          }`}
          aria-disabled={pagination.page >= pagination.totalPages}
          tabIndex={pagination.page >= pagination.totalPages ? -1 : 0}
        >
          Next
        </span>
      </div>
      <div className="hidden 2xl:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="inline-flex rounded-md shadow-xs items-center gap-2">
          per page: 
          <div className="relative flex-1 min-w-[150px]">
            <Select
              id="size"
              options={optionsSize}
              placeholder="Select Size"
              value={pagination.size.toString()}
              onChange={handleChangeSize}
              className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
            />
            <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {(pagination.page - 1) * pagination.size + 1} - {Math.min(pagination.page * pagination.size, pagination.totalData)} of {pagination?.totalData ?? "-"} rows
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
            <span
              role="button"
              onClick={() => pagination.page > 1 && pagination.onPageChange(pagination.page - 1)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 dark:ring-gray-800 ${
                pagination.page <= 1
                  ? "text-gray-300 dark:text-white/40 cursor-not-allowed bg-gray-100 dark:bg-white/[0.01]"
                  : "text-gray-400 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-white/[0.06]"
              }`}
              aria-disabled={pagination.page <= 1}
              tabIndex={pagination.page <= 1 ? -1 : 0}
            >
              <span className="sr-only">Previous</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="number"
              min={1}
              max={pagination.totalPages}
              value={inputPage}
              onChange={handleInputChange}
              className="relative inline-flex w-16 items-center px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-none dark:text-white/90 dark:ring-gray-800 bg-transparent text-center"
              style={{ appearance: "textfield" }}
            />
            <span
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset focus:z-20 dark:text-white/90 dark:ring-gray-800"
            >
              of
            </span>
            <span
              role="button"
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white/90 dark:ring-gray-800 dark:hover:bg-white/[0.06]"
            >
              {pagination.totalPages}
            </span>
            <span
              role="button"
              onClick={() => pagination.page < pagination.totalPages && pagination.onPageChange(pagination.page + 1)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 dark:ring-gray-800 ${
                pagination.page >= pagination.totalPages
                  ? "text-gray-300 dark:text-white/40 cursor-not-allowed bg-gray-100 dark:bg-white/[0.01]"
                  : "text-gray-400 hover:bg-gray-50 dark:text-white/90 dark:hover:bg-white/[0.06]"
              }`}
              aria-disabled={pagination.page >= pagination.totalPages}
              tabIndex={pagination.page >= pagination.totalPages ? -1 : 0}
            >
              <span className="sr-only">Next</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationContainer;
