"use client";
import React, { useState, useEffect, useRef } from "react";
import SlikMainHeader, { ESlikActionButtonHeaders } from "@/components/header/SlikMainHeader";
import ReviewData from "@/services/reviewData";
import ProgressBarD01F01Component from "./ProgressBarD01F01Component";
import TableErrorD01P01Component from "./TablesErrorD01F01Component";
import { showAlert } from "@/utils/showAlert";
import SlikServices from "@/services/slik";
import useRedirectPage from "@/hooks/useRedirectLink";

const ValidationProgressMainComponent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [periodOptions, setPeriodOptions] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [showData, setShowData] = useState<boolean>(false);
  const isRun = useRef(false);
  const requestPeriodValidation = localStorage.getItem("requestPeriodValidation");
  const redirectPage = useRedirectPage();

  const [disabledButtons, setDisabledButtons] = useState<ESlikActionButtonHeaders[]>([
    ESlikActionButtonHeaders.DownloadGenerateFile,
    ESlikActionButtonHeaders.ButtonView
  ]);

  const [hiddenButtons] = useState<ESlikActionButtonHeaders[]>([
    ESlikActionButtonHeaders.ButtonView,
    ESlikActionButtonHeaders.SelectedSegment,
    ESlikActionButtonHeaders.DownloadGenerateFile,
    ESlikActionButtonHeaders.GenerateData,
    ESlikActionButtonHeaders.SetValidation,
    ESlikActionButtonHeaders.GenerateFile,
  ]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; 
    setDisabledButtons(prev => prev.filter(action => action !== ESlikActionButtonHeaders.ButtonView));
    setSelectedPeriod(val);
    if (val) {
      localStorage.setItem("requestPeriodValidation", JSON.stringify({
        period: val,
      }));
    }
  };

  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSegment(e.target.value);
  };

  const handleView = () => {
    setShowData(true);
  };

  const handleActionClick = (action: string, key: string) => {
    console.log(`Action clicked: ${action} - ${key}`);
    switch (action) {
    case ESlikActionButtonHeaders.SubmitValidation:
      onSubmitValidation();
      break;
    case ESlikActionButtonHeaders.DataD01:
      redirectPage(`/validation-progress/p1/period/${selectedPeriod}/segment/d01`);
      break;
    case ESlikActionButtonHeaders.DataF01:
      redirectPage(`/validation-progress/p1/period/${selectedPeriod}/segment/f01`);
      break;
    }
  };

  const fetchOptions = async () => {
    const options = await ReviewData.lsPeriod();
    if (options) setPeriodOptions(options);
  };

  const onSubmitValidation = async () => {
    const result = await SlikServices.submit({
      period: selectedPeriod,
      segment: "ALL",
    });
    if (result?.message === "success submit for all segment") {
      showAlert({
        title: "success!",
        text: "Data has been submitted successfully.",
        icon: "success",
        confirmButtonText: "Close",
      });
    } else {
      showAlert({
        title: "failed!",
        text: result?.message ?? "Failed to submit data.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
    return;
  };

  useEffect(() => {
    if (isRun.current === false) {
      fetchOptions();
      isRun.current = true;
    }
  }, []);

  useEffect(() => {
    // Check and parse requestPeriodValidation from localStorage
    if (requestPeriodValidation) {
      try {
        const parsed = JSON.parse(requestPeriodValidation);
        if (parsed.period && periodOptions.length > 0) {
          setSelectedPeriod(parsed.period);
          setShowData(true); // or call handleView();
        }
      } catch {
        console.error("Invalid requestPeriodValidation in localStorage");
      }
    }
    
  }, [periodOptions, requestPeriodValidation]);

  return (
    <>
      <SlikMainHeader
        selectedPeriod={selectedPeriod}
        periodOptions={periodOptions}
        selectedSegment={selectedSegment}
        onPeriodChange={handlePeriodChange}
        onSegmentChange={handleSegmentChange}
        onView={handleView}
        onActionClick={handleActionClick}
        disabledActions={disabledButtons}
        hideAction={hiddenButtons}
      />
      {
        showData && (
          <>
            <ProgressBarD01F01Component period={selectedPeriod}/>
            <br />

            <div
              className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 mx-auto my-6"
              style={{ maxWidth: "90%" }}
            ></div>

            <TableErrorD01P01Component period={selectedPeriod} />
          </>
        )
      }
      {/* {
        showData && isLoading && (
          <div role="status" className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-[20px] dark:bg-gray-700 mb-2.5"></div>
          </div>
        )
      } */}
    </>
  );
};

export default ValidationProgressMainComponent;
