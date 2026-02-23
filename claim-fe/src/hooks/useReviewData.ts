
import { IOptions } from "@/interfaces/IOptions";
import ReviewData from "@/services/reviewData";

export function useReviewData() {

  const getDataOptionsPeriod: () => Promise<IOptions[]> = async () => {
    const lsPeriod = await ReviewData.lsPeriod();
    return lsPeriod?.map((item => ({
      label: item,
      value: item,
    }))) || [];
  };

  const getDataCompareMISandD01P1: (period: string) => Promise<Record<string, string>> = async (period: string) => {
    const data = await ReviewData.getDtCompareMISandD01P1(period);
    if (!data) return {};
    return data;
  };

  const getDataCompareMISandF01P1: (period: string) => Promise<Record<string, string>> = async (period:string) => {
    const data = await ReviewData.getDtCompareMISandF01P1(period);
    if (!data) return {};
    return data;
  };

  const getDataCreditQuality: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtCreditQuality(period);
    if (!data) return [];
    return data;
  };

  const getDataConditionData: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtConditionData(period);
    if (!data) return [];
    return data;
  };

  const getDataRestructData: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtRestructData(period);
    if (!data) return [];
    return data;
  };

  const getDataRangePart1: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtRangePart1(period);
    if (!data) return [];
    return data;
  };

  const getDataRangePart2: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtRangePart2(period);
    if (!data) return [];
    return data;
  };

  const getDataTotalF01: (period: string) => Promise<Record<string, string>[]> = async (period:string) => {
    const data = await ReviewData.getDtTotalF01(period);
    if (!data) return [];
    return data;
  };

  return {
    getDataOptionsPeriod,
    getDataCompareMISandD01P1,
    getDataCompareMISandF01P1,
    getDataCreditQuality,
    getDataConditionData,
    getDataRestructData,
    getDataRangePart1,
    getDataRangePart2,
    getDataTotalF01,
  };
}
