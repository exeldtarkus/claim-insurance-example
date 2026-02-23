import React, { useEffect, useState } from "react";
import { useReviewData } from "@/hooks/useReviewData";
import TableComponent from "@/components/tables/TableComponent";

const headers = [
  { id: "bakiDebetMin", label: "Baki Debet Min" },
  { id: "tunggakanPokokMin", label: "Tunggakan Pokok Min" },
  { id: "tunggakanBungaMin", label: "Tunggakan Bunga Min" },
  { id: "sukuBungaMin", label: "Suku Bunga Min" },
  { id: "bakiDebetMax", label: "Baki Debet Max" },
  { id: "tunggakanPokokMax", label: "Tunggakan Pokok Max" },
  { id: "tunggakaBungaMax", label: "Tunggaka Bunga Max" },
  { id: "sukuBungaMax", label: "Suku Bunga Max" },
];

const RangePart2Section = ({ isGetData, period, onFetched }: { isGetData: boolean; period: string; onFetched: () => void }) => {
  const { getDataRangePart2 } = useReviewData();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    getDataRangePart2(period)
      .then((data) => setTableData({ headers, body: data }))
      .finally(() => setIsLoading(false));
    onFetched();
  }, [isGetData, period, getDataRangePart2, onFetched]);

  return (
    <div className="col-span-6">
      <TableComponent
        title={`Range F01 Part 2`}
        tableData={{
          headers: tableData.headers,
          body: tableData.body,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RangePart2Section;