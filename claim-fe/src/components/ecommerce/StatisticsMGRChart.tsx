/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { now } from "@/utils/TimeUtils";
import Dashboard from "@/services/dashboard";
import LoadingAnimatePulse from "../loading/LoadingAnimatePulse";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const StatisticsMGRChart: React.FC = () => {
  const year = now("yearNow");
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      const data = await Dashboard.statistics(Number(year));
      if (data) {
        setStatisticsData(data);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [year]);

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const d01Data = months.map(month => {
    if (statisticsData) {
      const monthData = statisticsData.find((item: any) => item[month]);
      return monthData ? monthData[month]?.D01 || 0 : 0;
    }
    return 0;
  });

  const f01Data = months.map(month => {
    if (statisticsData) {
      const monthData = statisticsData.find((item: any) => item[month]);
      return monthData ? monthData[month]?.F01 || 0 : 0;
    }
    return 0;
  });

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: months,
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => value.toLocaleString(),
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "D01",
      data: d01Data,
    },
    {
      name: "F01",
      data: f01Data,
    },
  ];

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ${loading ? "blurred" : ""}`}>
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics data MGR in {year}
          </h3>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <LoadingAnimatePulse height="h-20" width="w-full" borderRadius="rounded-xl" />
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsMGRChart;
