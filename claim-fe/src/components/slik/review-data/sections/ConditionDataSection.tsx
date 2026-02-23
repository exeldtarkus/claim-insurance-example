import React, { useEffect, useState } from "react";
import { useReviewData } from "@/hooks/useReviewData";
import TableComponent from "@/components/tables/TableComponent";

const headers = [
  { id: "type", label: "Type" },
  { id: "totalSum", label: "Nominal" },
  { id: "totalCount", label: "Transaction" },
];

const ConditionDataSection = ({ isGetData, period, onFetched }: { isGetData: boolean; period: string; onFetched: () => void }) => {
  const { getDataConditionData } = useReviewData();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    getDataConditionData(period)
      .then((data) => setTableData({ headers, body: data }))
      .finally(() => setIsLoading(false));
    onFetched();
  }, [isGetData, period, getDataConditionData, onFetched]);

  return (
    <TableComponent
      title={`Data Kondisi`}
      tableData={{
        headers: tableData.headers,
        body: tableData.body,
      }}
      isLoading={isLoading}
      minWidth="700"
    />
  );
};

export default ConditionDataSection;