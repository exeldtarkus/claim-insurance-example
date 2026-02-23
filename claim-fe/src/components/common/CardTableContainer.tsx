"use client";
import React from "react";
// import DropdownV2 from "@/components/ui/dropdown/DropdownV2";
import ComponentCard from "@/components/common/ComponentCard";
import TableDynamic from "@/components/tables/TableDynamic";
import PaginationContainer from "./PaginationContainer";
import { TableData } from "@/interfaces/ITableData";

const sortedHeaders = (dataTable: TableData) => {
  const sortedBody = dataTable.body.map((row: Record<string, string>) => {
    const sortedRow: { [key: string]: string } = {};
    dataTable.headers.forEach((header) => {
      sortedRow[header.id] = row[header.id as keyof typeof row]; // Ensure the order follows headers
    });
    return sortedRow;
  });

  const sortedTableData = {
    ...dataTable,
    body: sortedBody,
  };

  return sortedTableData;
};

type CardTableContainerProps = {
  title: string; // Title of the card
  desc?: string; // Description of the card
  isLoading: boolean; // Loading state
  tableData: {
    headers: { id: string; label: string }[]; // Header of the table
    body: Record<string, string>[]; // Body of the table
  }; // Callback function prop
  minWidth?: string; // Minimum width of the table
  viewMoreLink?: string; // Optional prop for view more functionality
  isPaginated?: boolean; // Optional prop to indicate if pagination is used
  pagination?: {
    page: number; // Current page number
    size: number; // Number of items per page
    totalPages: number; // Total number of pages
    totalData: number; // Total number of data items
    onPageChange: (page: number) => void; // Callback function to change page
    onSizeChange: (page: number) => void; // Callback function to change page
  },
  isEditable?: boolean; // Optional prop to indicate if the table is editable
  tableDataOriginal?: Record<string, string>[];
  onBodyChange?: (newBody: Record<string, string>[]) => void; // Add this
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
  onSaveChanges?: () => void; // Callback function for save changes
  setFixingValidation?: () => void; // Callback function to set fixing validation state
  isFixingValidation?: boolean; // Optional prop to indicate if fixing validation is enabled
  isSubmitValidation?: boolean; // Optional prop to indicate if submit validation is enabled
  onSubmitValidation?: () => void; // Callback function for submit validation
  disableFieldsInput?: string[];
  primaryKeys?: string[];
  returnOnlyEditedValue?: boolean;
};


const CardTableContainer: React.FC<CardTableContainerProps> = (props) => {

  const {
    title,
    desc = "",
    isLoading,
    tableData,
    minWidth = "1102",
    viewMoreLink = "", // Optional prop for view more functionality
    isPaginated = false, // Optional prop to indicate if pagination is used
    pagination,
    isEditable = false, // Optional prop to indicate if the table is editable
    onBodyChange,
    isSaveChanges = false, // Optional prop to indicate if save changes is enabled
    onSaveChanges, // Callback function for save changes
    isFixingValidation = false, // Optional prop to indicate if fixing validation is enabled
    setFixingValidation, // Callback function to set fixing validation state
    isSubmitValidation = false, // Optional prop to indicate if submit validation is enabled
    onSubmitValidation, // Callback function for submit validation
    disableFieldsInput = [],
    primaryKeys = [],
    returnOnlyEditedValue=false,
  } = props;

  // const hasRun = useRef(false);
  const sortedTableData = sortedHeaders(tableData);
  const originData = JSON.parse(JSON.stringify(tableData.body));

  return (
    <ComponentCard
      title={title}
      desc={desc}
      viewMoreLink={viewMoreLink}
      isSaveChanges={isSaveChanges}
      onSaveChanges={onSaveChanges}
      isFixingValidation={isFixingValidation}
      setFixingValidation={setFixingValidation}
      isSubmitValidation={isSubmitValidation}
      onSubmitValidation={onSubmitValidation}
    >
      <TableDynamic
        tableData={sortedTableData}
        isLoading={isLoading}
        minWidth={minWidth}
        isEditable={isEditable}
        tableDataOriginal={originData}
        onBodyChange={onBodyChange}
        disableFieldsInput={disableFieldsInput}
        primaryKeys={primaryKeys}
        returnOnlyEditedValue={returnOnlyEditedValue}
      />
      {isPaginated && pagination && (
        <PaginationContainer isLoading={isLoading} pagination={pagination}/>
      )}
    </ComponentCard>
  );
};

export default CardTableContainer;
