"use client";

import React, { useState, useEffect } from "react";
import CircularProgressBarOne from "@/components/progress-bar/CircularProgressbarOne";
import useIsMobile from "@/hooks/useIsMobile";
import { useSlikValidationProgress } from "@/hooks/useSlikValidationProgress";
import SlikServices from "@/services/slik";

type Props = {
  period: string;
};

const ProgressBarD01F01Component: React.FC<Props> = ({ period }) => {
  const [d01ProgressPercent, setD01ProgressPercent] = useState<number>(0);
  const [f01ProgressPercent, setF01ProgressPercent] = useState<number>(0);
  const [d01RowsSuccess, setD01RowsSuccess] = useState<number>(0);
  const [d01RowsFailed, setD01RowsFailed] = useState<number>(0);
  const [f01RowsSuccess, setF01RowsSuccess] = useState<number>(0);
  const [f01RowsFailed, setF01RowsFailed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const progress = useSlikValidationProgress(selectedPeriod);

  const getTotalRecordD01 = async (): Promise<{ success: number; failed: number }> => {

    let succesRow = 0;
    let failedRow = 0;

    if (d01RowsSuccess === 0 || d01RowsFailed === 0) {
      const [getTotalP1, getTotalP2] = await Promise.all([
        SlikServices.getDataP1({
          page: "1",
          period: selectedPeriod,
          segment: "d01",
          size: "1"
        }),
        SlikServices.getDataP2({
          page: "1",
          period: selectedPeriod,
          segment: "d01",
          size: "1"
        })
      ]);

      succesRow = Number(getTotalP2.totalData);
      failedRow = Number(getTotalP1.totalData);

      setD01RowsSuccess(succesRow);
      setD01RowsFailed(failedRow);
    }
    return { success: succesRow, failed: failedRow };
  };

  const getTotalRecordF01 = async (): Promise<{ success: number; failed: number }> => {

    let succesRow = 0;
    let failedRow = 0;

    if (f01RowsSuccess === 0 || f01RowsFailed === 0) {

      const [getTotalP1, getTotalP2] = await Promise.all([
        SlikServices.getDataP1({
          page: "1",
          period: selectedPeriod,
          segment: "f01",
          size: "1"
        }),
        SlikServices.getDataP2({
          page: "1",
          period: selectedPeriod,
          segment: "f01",
          size: "1"
        })
      ]);

      succesRow = Number(getTotalP2.totalData);
      failedRow = Number(getTotalP1.totalData);

      setF01RowsSuccess(succesRow);
      setF01RowsFailed(failedRow);
    }

    return { success: succesRow, failed: failedRow };
  };

  const persenNumber = (number: number): number => {
    const roundedUpTwoDecimals = Math.ceil(number);
    return Number(roundedUpTwoDecimals.toFixed(2));
  };

  useEffect(() => {
    setIsLoading(true);
    setSelectedPeriod(period);
    setD01RowsSuccess(0);
    setD01RowsFailed(0);
    setF01RowsSuccess(0);
    setF01RowsFailed(0);
  }, [period]);

  useEffect(() => {
    if (progress !== undefined) {
      setIsLoading(false);
    }

    const d01Percent = persenNumber(progress?.progressD01?.progress_bar_percent || 0);
    const f01Percent = persenNumber(progress?.progressF01?.progress_bar_percent || 0);

    const hasProgress =
      (progress?.progressD01) ||
      (progress?.progressF01);

    if (hasProgress) {
      setD01ProgressPercent(d01Percent);
      setF01ProgressPercent(f01Percent);

      if (d01Percent > 99) getTotalRecordD01();
      if (f01Percent > 99) getTotalRecordF01();

      setShowProgressBar(true);
    } else {
      setShowProgressBar(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, period]);

  return showProgressBar ? (
    <div className="flex justify-center items-center space-x-8 mt-6 flex-col sm:flex-row">
      {/* D01 Section */}
      <div className="flex items-center mb-6 sm:mb-0">
        {isLoading ? (
          <div role="status" className="animate-pulse w-30">
            <div className="h-30 bg-gray-200 rounded-[20px] dark:bg-gray-700 mb-2.5"></div>
          </div>
        ) : (
          <>
            <div className="mr-4">
              <span className="text-md font-semibold dark:text-white">D01</span>
              <p className="text-sm font-semibold text-green-500 dark:text-green-400">
                Success: {d01RowsSuccess.toLocaleString()}
              </p>
              <p className="text-sm font-semibold text-red-500 dark:text-red-400">
                Failed: {d01RowsFailed.toLocaleString()}
              </p>
            </div>
            <CircularProgressBarOne progress={d01ProgressPercent} label="D01 Progress" />
          </>
        )}
      </div>

      {/* Divider */}
      {isMobile ? (
        <div
          className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 mx-auto my-6"
          style={{ maxWidth: "90%" }}
        ></div>
      ) : (
        <div className="h-20 w-px bg-gray-300 dark:bg-gray-700 mx-4 sm:mx-6"></div>
      )}

      {/* F01 Section */}
      <div className="flex items-center ml-4">
        {isLoading ? (
          <div role="status" className="animate-pulse w-30">
            <div className="h-30 bg-gray-200 rounded-[20px] dark:bg-gray-700 mb-2.5"></div>
          </div>
        ) : (
          <>
            <CircularProgressBarOne progress={f01ProgressPercent} label="F01 Progress" />
            <div className="ml-4">
              <span className="text-md font-semibold dark:text-white">F01</span>
              <p className="text-sm font-semibold text-green-500 dark:text-green-400">
                Success: {f01RowsSuccess.toLocaleString()}
              </p>
              <p className="text-sm font-semibold text-red-500 dark:text-red-400">
                Failed: {f01RowsFailed.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center space-x-8 mt-6 flex-col sm:flex-row"></div>
  );
};

export default ProgressBarD01F01Component;
