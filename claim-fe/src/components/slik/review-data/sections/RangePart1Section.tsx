import React, { useEffect, useState } from "react";
import { useReviewData } from "@/hooks/useReviewData";
import TableComponent from "@/components/tables/TableComponent";

const headers = [
  { id: "plafonAwalMin", label: "Plafon Awal Min" },
  { id: "plafonMin", label: "Plafon Min" },
  { id: "realisasiMin", label: "Realisasi Min" },
  { id: "dendaMin", label: "Denda Min" },
  { id: "plafonAwalMax", label: "Plafon Awal Max" },
  { id: "plafonMax", label: "Plafon Max" },
  { id: "realisasiMax", label: "Realisasi Max" },
  { id: "dendaMax", label: "Denda Max" },
];

const RangePart1Section = ({ isGetData, period, onFetched }: { isGetData: boolean; period: string; onFetched: () => void }) => {
  const { getDataRangePart1 } = useReviewData();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    getDataRangePart1(period)
      .then((data) => setTableData({ headers, body: data }))
      .finally(() => setIsLoading(false));
    onFetched();
  }, [isGetData, period, getDataRangePart1, onFetched]);

  return (
    <div className="col-span-6">
      <TableComponent
        title={`Range F01 Part 1`}
        tableData={{
          headers: tableData.headers,
          body: tableData.body,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RangePart1Section;