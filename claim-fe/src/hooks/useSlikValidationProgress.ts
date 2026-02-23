/* eslint-disable react-hooks/exhaustive-deps */
import SlikProgressBarServices from "@/services/slikProgressBar";
import { IDBSlikProgressBar } from "../lib/query/sqllite.query.lib";
import { useEffect, useState } from "react";

interface IProgressData {
  progressD01: IDBSlikProgressBar | null;
  progressF01: IDBSlikProgressBar | null;
}

export function useSlikValidationProgress(period: string): IProgressData {
  const [progress, setProgress] = useState<IProgressData>({
    progressD01: null,
    progressF01: null,
  });

  const retryFetchInMs = 10000; // Retry every 10 seconds

  const fetchProgress = async () => {
    try {
      const res = await SlikProgressBarServices.get({
        period: period,
      });

      if (!res.data || res.errorMessage) {
        console.warn("No data or error occurred while fetching progress - ", res.errorMessage);
        setProgress({
          progressD01: null,
          progressF01: null,
        });
        return;
      }
      const progressD01 = (res.data as IDBSlikProgressBar[]).find(item => item.schema === "D01") || null;
      const progressF01 = (res.data as IDBSlikProgressBar[]).find((item) => item.schema === "F01") || null;

      setProgress({ progressD01, progressF01 });
    } catch (error) {
      console.error("Error fetching progress data:", error);
      setProgress({
        progressD01: null,
        progressF01: null,
      });
    }
  };

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(() => {
      console.log("Retrying fetch every 10 seconds...");
      fetchProgress();
    }, retryFetchInMs);

    return () => clearInterval(interval);
  }, [period]);

  return progress;
}
