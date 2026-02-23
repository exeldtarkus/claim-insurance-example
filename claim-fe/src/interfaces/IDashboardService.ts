export interface IMonthlyData {
  D01: number;
  F01: number;
}

export  interface IStatisticsData {
  January: IMonthlyData;
  February: IMonthlyData;
  March: IMonthlyData;
  April: IMonthlyData;
  May: IMonthlyData;
  June: IMonthlyData;
  July: IMonthlyData;
  August: IMonthlyData;
  September: IMonthlyData;
  October: IMonthlyData;
  November: IMonthlyData;
  December: IMonthlyData;
}

export interface IDashboardServicesResponse {
  data: IStatisticsData[];
}
