import React, { useEffect, useState } from "react";
import { useReviewData } from "@/hooks/useReviewData";
import TableComponent from "@/components/tables/TableComponent";

const headers = [
  { id: "plafonAwalSum", label: "Plafon Awal" },
  { id: "plafonSum", label: "Plafon" },
  { id: "realisasiSum", label: "Realisasi" },
  { id: "dendaSum", label: "Denda" },
  { id: "bakiDebetSum", label: "Baki Debet" },
  { id: "tunggakanPokokSum", label: "Tunggakan Pokok" },
  { id: "tunggakanBungaSum", label: "Tunggakan Bunga" },
];

const TotalF01Section = ({ isGetData, period, onFetched }: { isGetData: boolean; period: string; onFetched: () => void }) => {
  const { getDataTotalF01 } = useReviewData();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    getDataTotalF01(period)
      .then((data) => setTableData({ headers, body: data }))
      .finally(() => setIsLoading(false));
    onFetched();
  }, [isGetData, period, getDataTotalF01, onFetched]);

  return (
    <div className="col-span-6">
      <TableComponent
        title={`Total F01`}
        tableData={{
          headers: tableData.headers,
          body: tableData.body,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TotalF01Section;