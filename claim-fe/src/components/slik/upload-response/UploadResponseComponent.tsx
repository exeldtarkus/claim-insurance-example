/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";
import FileInput from "@/components/form/input/FileInput";
import { etlErrTextToJson } from "@/utils/EtlerrToJson";
import type { IEtlErrorRecordD01, IEtlErrorRecordF01 } from "@/lib/etlerr.slik.ojk.error.field.mapping";
import { uploadResponseTableHeaderD01, uploadResponseTableHeaderF01 } from "@/lib/table.header.upload.response.ojk";
import CardTableContainer from "@/components/common/CardTableContainer";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import SweetAlert from "@/components/ui/alert/SweetAlert";
import { useReviewData } from "@/hooks/useReviewData";
import { IOptions } from "@/interfaces/IOptions";
import SlikServices from "@/services/slik";
import TableComponent from "@/components/tables/TableComponent";
import LoadingBoxJump from "@/components/loading/LoadingBoxJump";

const UploadResponseComponent: React.FC = () => {
  const [parsedData, setParsedData] = useState<IEtlErrorRecordD01[] | IEtlErrorRecordF01[] | null>(null);
  const [originData, setOriginData] = useState<IEtlErrorRecordD01[] | IEtlErrorRecordF01[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<"D01" | "F01" | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [tableTitle, setTableTitle] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableHeader, setTableHeader] = useState<{ id: string; label: string }[] | null>(null);
  const [savedData, setSavedData] = useState<Record<string, string>[] | null>(null);
  const [optionsPeriod, setOptionsdPeriod] = useState<IOptions[]>([]);
  const [filename, setFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getDataOptionsPeriod } = useReviewData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const optionUpload = [
    { label: "D01", value: "D01" },
    { label: "F01", value: "F01" },
  ];

  useEffect(() => {
    if (selectedPeriod === null) {
      const fetchOptions = async () => {
        const options = await getDataOptionsPeriod();
        setOptionsdPeriod(options);
      };
      fetchOptions();
      setIsLoading(false);
    }
  },[selectedPeriod]);

  const checkingFilename = (filename: string): boolean => {
    const fileName = filename;
    const filenamePeriod = `${fileName.split(".")[2]}-${fileName.split(".")[3]}`;

    if (filenamePeriod !== selectedPeriod) {
      setErrorMessage("File upload period not same with selected period");
      return false;
    }

    const findSegmentOnFileName = fileName.split(".").find(el => el === selectedSegment);
    if (!findSegmentOnFileName) {
      setErrorMessage("File upload not part in segment");
      return false;
    }
    return true;
  };


  const setErrorMessage = (message: string) => {
    setIsLoading(false);
    SweetAlert({
      title: "something not corrected",
      text: message,
      icon: "error",
      confirmButtonText: "close",
      options: {
        animation: true,
        position: "center"
      }
    });
  };

  const clearStage = (option: { resetFile?: boolean }) => {
    setParsedData(null);
    setError(null);
    setUploadedFile(null);
    setTableTitle("");
    setShowTable(false);
    setTableHeader(null);
    setSavedData(null);
    setSelectedPeriod(null);
    setSelectedSegment(null);
    setFilename(null);

    if (option.resetFile === true && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const existSegment = selectedSegment;
    const existPeriod = selectedPeriod;
    const file = event.target.files?.[0];

    clearStage({});
    setSelectedSegment(existSegment);
    setSelectedPeriod(existPeriod);

    if (!file) return;

    if (!selectedSegment) {
      clearStage({});
      setErrorMessage("Please select a segment before uploading.");
      return;
    }

    const fileName = file.name;
    const check = checkingFilename(fileName);
    if (!check) {
      return;
    }

    setUploadedFile(file);
    setFilename(fileName);
  };

  const onClickViews = async () => {
    if (!uploadedFile || !selectedSegment || !selectedPeriod) {
      setErrorMessage("Please select segment, period, and file.");
      return;
    }

    const fileName = uploadedFile.name;
    const check = checkingFilename(fileName);
    if (!check) {
      return;
    }

    setShowTable(false);

    try {
      const fileText = await uploadedFile.text();
      const result = etlErrTextToJson(fileText, selectedSegment);
      console.log("result", result);

      if (result === "BROKEN_FILE") {
        clearStage({});
        setErrorMessage("Generate File is Broken, please provide corrected file");
        return;
      }

      setShowTable(true);
      setError(null);
      setTableTitle(`${selectedSegment} - ${selectedPeriod} - View`);

      if (selectedSegment === "D01") {
        setTableHeader(uploadResponseTableHeaderD01);
        setParsedData(result as []);
        setOriginData(result as []);
      }

      if (selectedSegment === "F01") {
        setTableHeader(uploadResponseTableHeaderF01);
        setParsedData(result as []);
        setOriginData(result as []);
      }
      return;
    } catch (err: any) {
      clearStage({});
      setErrorMessage("Failed to read file.");
      return;
    }
  };

  const onClickSubmit = async () => {
    setIsLoading(true);
    if (!savedData || savedData.length === 0) {
      setErrorMessage("Nothing changes.");
      return;
    }

    if (!selectedPeriod) {
      setErrorMessage("Please select a period before submitting.");
      return;
    }

    if (!filename) {
      setErrorMessage("filename not record please try again");
      return;
    }

    const createJson = await SlikServices.createdJson({filename: filename, data: savedData}).catch(error => {
      setErrorMessage("http: failed created json, try again");
      return;
    });

    const filePath = createJson?.filePath;

    if (!filePath) {
      setErrorMessage("failed created json, try again");
      return;
    }

    // console.log("filePath", filePath);
    await SlikServices.submit({filePath: filePath, period: selectedPeriod, segment: selectedSegment as any});

    await SlikServices.removeJson({filepath: filePath});
    clearStage({ resetFile: true });
    // window.location.reload();

    setIsLoading(false);
    SweetAlert({
      title: "Submit Data",
      text: "success requested data, please wait notification",
      icon: "success",
      confirmButtonText: "close",
      options: {
        animation: true,
        position: "center"
      }
    });
  };

  const onClickPeriod = async (val: string) => {
    const existSegment = selectedSegment;
    clearStage({resetFile: true});
    setSelectedSegment(existSegment);
    setSelectedPeriod(val);
  };

  const onBodyChange = (newBody: Record<string, string>[]) => {
    setSavedData(newBody);
  };

  if (isLoading) {
    return <LoadingBoxJump />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Dropdown Segment */}
        <div className="relative min-w-[150px]">
          <Select
            id="selectedSegment"
            options={optionUpload}
            placeholder="Select segment"
            value={selectedSegment ?? ""}
            onChange={(event) => {
              const { value } = event.target;
              clearStage({ resetFile: true });
              setSelectedSegment(value as "D01" | "F01");
            }}
            className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
          />
          <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
            <ChevronDownIcon />
          </span>
        </div>

        {/* Dropdown Periode */}
        <div className="relative min-w-[180px]">
          <Select
            id="selectedPeriod"
            options={optionsPeriod}
            placeholder="Select period"
            value={selectedPeriod ?? ""}
            onChange={(event) => {
              const { value } = event.target;

              onClickPeriod(value as string);
            }}
            className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-40"
            disabled={!selectedSegment}
          />
          <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
            <ChevronDownIcon />
          </span>
        </div>

        {/* File Input */}
        <div className="w-max">
          <FileInput
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="w-64"
            category={["slikOjkFileError"]}
            disabled={!selectedSegment || !selectedPeriod}
          />
        </div>

        {/* Button View/Submit */}
        <div>
          <Button
            variant="outline"
            onClick={showTable ? onClickSubmit : onClickViews}
            size="sm"
            disabled={!selectedSegment || !uploadedFile || !selectedPeriod}
          >
            {showTable ? "Submit" : "View"}
          </Button>
        </div>
      </div>

      {/* Tabel */}
      {showTable ? (
        <TableComponent
          title={tableTitle}
          tableData={{
            headers: tableHeader!,
            body: parsedData as unknown as Record<string, string>[],
          }}
          tableDataOriginal={originData as unknown as Record<string, string>[]}
          isEditable={true}
          onBodyChange={(val) => onBodyChange(val as any)}
        />
      ) : null}
    </div>
  );
};

export default UploadResponseComponent;
