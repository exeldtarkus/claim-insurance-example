"use client";
import React, { useState, useEffect } from "react";
import { BoxIconLine } from "@/icons";
import { now } from "@/utils/TimeUtils";
import Dashboard from "@/services/dashboard";
import LoadingAnimatePulse from "../loading/LoadingAnimatePulse";
import MetricsBadge from "../common/MetricsBadge";

interface IData {
  lastPeriod: {
    Period: string;
    total_data: number;
  };
  totalAllData: number;
  percentage: number;
  percentageType: "Up" | "Down" | "Nothing-Change";
}

interface IDataMetricsContainer {
  d01: IData;
  f01: IData;
}


const SlikMetrics = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<IDataMetricsContainer | null>(null);
  const year = now("yearNow");

  useEffect(() => {
    const fetchStatistics = async () => {
      const data = await Dashboard.metrics(Number(year));
      if (data) {
        setMetricsData(data as unknown as IDataMetricsContainer);
        // setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [year]);


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              D-01
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metricsData?.d01?.lastPeriod?.total_data.toLocaleString() || 0}
            </h4>
          </div>

          {
            metricsData?.d01 ? (
              <MetricsBadge
                type={metricsData.d01.percentageType}
                value={metricsData.d01.percentage * 100}
              />
            ) : (
              <LoadingAnimatePulse width="w-32" height="h-8" />
            )
          }
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              F-01
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metricsData?.f01?.lastPeriod?.total_data?.toLocaleString() || 0}
            </h4>
          </div>

          {
            metricsData?.f01 ? (
              <MetricsBadge
                type={metricsData.f01.percentageType}
                value={metricsData.f01.percentage * 100}
              />
            ) : (
              <LoadingAnimatePulse width="w-32" height="h-8" />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SlikMetrics;
