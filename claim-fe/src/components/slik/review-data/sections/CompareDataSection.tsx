import React, { useEffect, useState } from "react";
import { useReviewData } from "@/hooks/useReviewData";
import TableComponent from "@/components/tables/TableComponent";

const headers = [
  { id: "segment", label: "Segment" },
  { id: "mis", label: "Data MIS" },
  { id: "p1", label: "Data Slik Phase 1" },
  { id: "p2", label: "Data Slik Phase 2" },
  { id: "diffMisWithP1", label: "Diff Phase 1 %" },
  { id: "diffMisWithP2", label: "Diff Phase 2 %" },
  { id: "updateCount", label: "Operasi Data Create" },
  { id: "createCount", label: "Operasi Data Update" },
];

const CompareDataSection = ({ isGetData, period, onFetched }: { isGetData: boolean; period: string; onFetched: () => void }) => {
  const { getDataCompareMISandD01P1, getDataCompareMISandF01P1 } = useReviewData();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });

  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    Promise.all([
      getDataCompareMISandD01P1(period),
      getDataCompareMISandF01P1(period),
    ])
      .then(([dataD01, dataF01]) => {
        setTableData({
          headers,
          body: [
            ...(Array.isArray(dataD01) ? dataD01 : [dataD01]),
            ...(Array.isArray(dataF01) ? dataF01 : [dataF01]),
          ],
        });
      })
      .finally(() => setIsLoading(false));
    onFetched(); // call this after fetching
  }, [isGetData, period, getDataCompareMISandD01P1, getDataCompareMISandF01P1, onFetched]);

  return (
    <div className="col-span-6">
      <TableComponent
        title={`Compare Data`}
        tableData={{
          headers: tableData.headers,
          body: tableData.body,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CompareDataSection;