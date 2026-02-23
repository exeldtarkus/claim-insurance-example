/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";
import SlikMainHeader, { ESlikActionButtonHeaders } from "@/components/header/SlikMainHeader";
import ReviewData from "@/services/reviewData";
import CompareDataSection from "./sections/CompareDataSection";
import CreditQualitySection from "./sections/CreditQualitySection";
import ConditionDataSection from "./sections/ConditionDataSection";
import RestructDataSection from "./sections/RestructDataSection";
import RangePart1Section from "./sections/RangePart1Section";
import RangePart2Section from "./sections/RangePart2Section";
import TotalF01Section from "./sections/TotalF01Section";
import SlikServices from "@/services/slik";
import { useRouter } from "next/navigation";
import SweetAlert from "@/components/ui/alert/SweetAlert";

const ReviewDataComponent: React.FC = () => {

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [periodOptions, setPeriodOptions] = useState<string[]>([]);
  const disabledActions = [
    ESlikActionButtonHeaders.DownloadGenerateFile,
    ESlikActionButtonHeaders.GenerateData,
    ESlikActionButtonHeaders.DataD01,
    ESlikActionButtonHeaders.DataF01,
    ESlikActionButtonHeaders.GenerateFile,
  ];
  const isRun = useRef(false);
  const router = useRouter();
  const [isGetDataCompareDataMIS, setIsGetDataCompareDataMIS] = useState(false);
  const [isGetDataCreditQuality, setIsGetDataCreditQuality] = useState(false);
  const [isGetDataConditionData, setIsGetDataConditionData] = useState(false);
  const [isGetDataRestructData, setIsGetDataRestructData] = useState(false);
  const [isGetDataRangePart1, setIsGetDataRangePart1] = useState(false);
  const [isGetDataRangePart2, setIsGetDataRangePart2] = useState(false);
  const [isGetDataTotalF01, setIsGetDataTotalF01] = useState(false);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPeriod(e.target.value);
  const handleView = () => {
    if (selectedPeriod) {
      setIsGetDataCompareDataMIS(true);
      setIsGetDataCreditQuality(true);
      setIsGetDataConditionData(true);
      setIsGetDataRestructData(true);
      setIsGetDataRangePart1(true);
      setIsGetDataRangePart2(true);
      setIsGetDataTotalF01(true);
    }
  };
  const handleActionClick = async (action: string, key: string) => {
    if (action === "Set Validation") {
      const errorMessage: string[] = [];

      if (selectedPeriod === "") {
        await SweetAlert({
          title: "Something not corrected",
          text: `please selected period first`,
          icon: "error",
          confirmButtonText: "close",
          options: {
            animation: true,
            position: "center"
          }
        });
        return;
      }

      await Promise.all([
        SlikServices.setValidationData({
          period: selectedPeriod,
          schema: "D-01"
        }).catch(err => errorMessage.push("Failed Process D01!")),
        SlikServices.setValidationData({
          period: selectedPeriod,
          schema: "F-01"
        }).catch(err => errorMessage.push("Failed Process F01!")),
      ]);


      if (errorMessage.length > 0) {
        await SweetAlert({
          title: "Something not corrected",
          text: `${errorMessage.join(" And ")}, Please try again!`,
          icon: "warning",
          confirmButtonText: "close",
          options: {
            animation: true,
            position: "center"
          }
        });
        return;
      }

      localStorage.setItem("requestPeriodValidation", JSON.stringify({
        period: selectedPeriod,
      }));

      await SweetAlert({
        title: "Success",
        text: `Data D01 and F01 has been submit, Please wait notification!`,
        icon: "success",
        confirmButtonText: "close",
        options: {
          animation: true,
          position: "center"
        }
      });
      router.push("/validation-progress");
      return;
    }
  };
  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSegment(e.target.value);
  };

  const [hiddenButtons] = useState<ESlikActionButtonHeaders[]>([
    ESlikActionButtonHeaders.SelectedSegment,
    ESlikActionButtonHeaders.DownloadGenerateFile,
    ESlikActionButtonHeaders.GenerateData,
    ESlikActionButtonHeaders.GenerateFile,
    ESlikActionButtonHeaders.DataD01,
    ESlikActionButtonHeaders.DataF01,
    ESlikActionButtonHeaders.SubmitValidation,
  ]);

  useEffect(() => {
    if (isRun.current) return; // Prevents the effect from running on the first render
    isRun.current = true; // Set to true after the first render

    const fetchOptions = async () => {
      const options = await ReviewData.lsPeriod();
      if(options)setPeriodOptions(options); // Set the first option as default
    };

    fetchOptions();
  });

  return (
    <>
      <SlikMainHeader
        selectedPeriod={selectedPeriod}
        periodOptions={periodOptions}
        onPeriodChange={handlePeriodChange}
        onView={handleView}
        onActionClick={handleActionClick}
        onSegmentChange={handleSegmentChange}
        selectedSegment={selectedSegment}
        disabledActions={disabledActions}
        hideAction={hiddenButtons}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-6">
        <CompareDataSection
          isGetData={isGetDataCompareDataMIS}
          period={selectedPeriod}
          onFetched={() => setIsGetDataCompareDataMIS(false)}
        />
        <RangePart1Section
          isGetData={isGetDataRangePart1}
          period={selectedPeriod}
          onFetched={() => setIsGetDataRangePart1(false)}
        />
        <RangePart2Section
          isGetData={isGetDataRangePart2}
          period={selectedPeriod}
          onFetched={() => setIsGetDataRangePart2(false)}
        />
        <TotalF01Section
          isGetData={isGetDataTotalF01}
          period={selectedPeriod}
          onFetched={() => setIsGetDataTotalF01(false)}
        />
        <div className="col-span-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
            <CreditQualitySection
              isGetData={isGetDataCreditQuality}
              period={selectedPeriod}
              onFetched={() => setIsGetDataCreditQuality(false)}
            />
            <ConditionDataSection
              isGetData={isGetDataConditionData}
              period={selectedPeriod}
              onFetched={() => setIsGetDataConditionData(false)}
            />
            <RestructDataSection
              isGetData={isGetDataRestructData}
              period={selectedPeriod}
              onFetched={() => setIsGetDataRestructData(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDataComponent;
