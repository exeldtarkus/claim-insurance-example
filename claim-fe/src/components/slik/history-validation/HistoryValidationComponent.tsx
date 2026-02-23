"use client";

import React, { useEffect, useState } from "react";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import LoadingBoxJump from "@/components/loading/LoadingBoxJump";
import Input from "@/components/form/input/InputField";
import { useReviewData } from "@/hooks/useReviewData";
import { IOptions } from "@/interfaces/IOptions";
import { DownloadIcon } from "@/icons";
import SlikServices from "@/services/slik";
import { ISlikHistoryValidation } from "@/interfaces/ISlikService";

const HistoryValidationComponent: React.FC = () => {

  const [isLoading, setIsLoading] = useState(false);
  const { getDataOptionsPeriod } = useReviewData();
  const [inputField, setInputField] = useState({
    optionsPeriod: [] as IOptions[],
    optionsSegment: [
      { label: "ALL Segment", value: "ALL" },
      { label: "D01 Segment", value: "D01" },
      { label: "F01 Segment", value: "F01" },
    ],
    selectedPeriod: null,
    selectedSegment: null,
    inputBatch: "",
  });

  const [ dataHistoryValidation, setDataHistoryValidation ] = useState<ISlikHistoryValidation[]>([]);

  const { optionsPeriod, optionsSegment, selectedPeriod, selectedSegment, inputBatch } = inputField;

  const handleChangeInputField = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {id, value} = event.target;

    setInputField((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleChangeInputFieldByKey = (key: string, value: number | string | IOptions[]) => {
    setInputField((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (selectedPeriod === null) {
      const fetchOptions = async () => {
        setIsLoading(true);
        try {
          const options = await getDataOptionsPeriod() as IOptions[];
          handleChangeInputFieldByKey("optionsPeriod", options);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const getDataHistoryValidation = async () => {
    if (!selectedPeriod || !selectedSegment) {
      return;
    }
    setIsLoading(true);
    try {
      const dataParams = {
        period: selectedPeriod,
        segment: selectedSegment,
        batch: inputBatch,
      };
      // Call the service to get history validation data
      const responseData = await SlikServices.getHistoryValidation(dataParams);
      // console.log("History Validation Data:", response);
      setDataHistoryValidation(responseData || []);
      setIsLoading(false);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching history validation data:", error);
      setIsLoading(false);
    }
  };

  const getFileTxt = async (filePath: string) => {
    if (!filePath) {
      return;
    }
    // Open in a new browser tab
    window.open(filePath, "_blank");
  };

  const onClickDownloadAll = async () => {
    if (!selectedPeriod || !selectedSegment || !inputBatch) {
      return;
    }
    setIsLoading(true);
    const responseData = await SlikServices.downloadAllHistories({
      period: selectedPeriod,
      segment: selectedSegment,
      batch: inputBatch,
    });
    setIsLoading(false);
    if (responseData && responseData.downloadUrl) {
      getFileTxt(responseData.downloadUrl);
    }
    // window.location.reload();
  };

  return (
    <div>
      {/* header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 shadow-md">
        <div className="flex justify-between">
          <div className="flex items-center gap-4 flex-wrap">

            {/* Dropdown Periode */}
            <div className="relative min-w-[180px]">
              <Select
                id="selectedPeriod"
                options={optionsPeriod}
                placeholder="Select period"
                value={selectedPeriod ?? ""}
                onChange={handleChangeInputField}
                className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-40"
              />
              <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>

            {/* Dropdown Segment */}
            <div className="relative min-w-[150px]">
              <Select
                id="selectedSegment"
                options={optionsSegment}
                placeholder="Select segment"
                value={selectedSegment ?? ""}
                onChange={handleChangeInputField}
                className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
              />
              <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>

            {/* Input Batch */}
            <div className="w-34">
              <Input
                id="inputBatch"
                type="text"
                placeholder="Input Batch"
                value={inputBatch}
                onChange={handleChangeInputField}
                disabled={!selectedSegment || !selectedPeriod}
              />
            </div>

            {/* Button View */}
            <div className="w-34">
              <Button
                variant="outline"
                onClick={getDataHistoryValidation}
                size="sm"
                disabled={!selectedSegment || !selectedPeriod || isLoading}
              >
                View
              </Button>
            </div>

          </div>

          {/* Button Download All */}
          <div>
            <Button
              variant="outline"
              onClick={onClickDownloadAll}
              size="sm"
              disabled={!selectedSegment || !inputBatch || !selectedPeriod || isLoading}
            >
              Download All
            </Button>
          </div>
        </div>
      </div>

      { isLoading && (
        <LoadingBoxJump />
      )}

      { !isLoading && (
        <div className="mt-6">
          <div className="space-y-3 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header row */}
              { dataHistoryValidation.length > 0 && (
                <div className="grid grid-cols-4 bg-blue-600 text-white p-3 rounded-[12px] dark:bg-gray-700">
                  <div>Nama Batch</div>
                  <div className="flex items-center justify-center">Periode</div>
                  <div className="flex items-center justify-center">Segment</div>
                  {/* <div className="flex items-center justify-center">Created At</div> */}
                  <div className="text-right pe-6"></div>
                </div>
              )}

              {/* Data rows */}
              { dataHistoryValidation.length > 0 && (
                dataHistoryValidation.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-[12px] border border-[#4A90E2] dark:border-none dark:text-white mt-2">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="font-medium">Batch {item.batch}</div>
                      <div className="flex items-center justify-center">{item.period}</div>
                      <div className="flex items-center justify-center">{item.segment}</div>
                      {/* <div className="flex items-center justify-center">{item.createdAt}</div> */}
                      <div className="flex items-center justify-end pe-6">
                        <DownloadIcon role="button" onClick={()=>{getFileTxt(item.filePath);}} />
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryValidationComponent;
