/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import TableComponent from "@/components/tables/TableComponent";
import { headersTableD01P1Version2, headersTableF01P1Version2 } from "./sections/HeaderBodyTable";
import SlikServices from "@/services/slik";

interface TableErrorD01P01ComponentProps {
  period: string;
};

const TableErrorD01P01Component: React.FC<TableErrorD01P01ComponentProps> = (Props) => {

  const { period } = Props;
  const [isLoading, setIsLoading] = useState(false);
  const [dataD01P1, setDataD01P1] = useState<any[]>([]);
  const [dataF01P1, setDataF01P1] = useState<any[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dataD01, dataF01] = await Promise.all([
          SlikServices.getDataP1({
            period: period,
            segment: "D01",
            page: "1",
            size: "5",
          }),
          SlikServices.getDataP1({
            period: period,
            segment: "F01",
            page: "1",
            size: "5",
          })
        ]);

        setDataD01P1(dataD01.items);
        setDataF01P1(dataF01.items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <div className="p-6">
      { isLoading ?
        (<></>) :
        (
          <div className={`flex ${isMobile ? "flex-col" : "flex-col"} space-y-6`}>
            <div className="col-span-6">
              {
                dataD01P1.length > 0 ? (
                  <TableComponent
                    title={`Data D01-P1`}
                    tableData={{
                      headers: headersTableD01P1Version2,
                      body: dataD01P1,
                    }}
                    isEditable={false}
                    viewMoreLink={`/validation-progress/p1/period/${period}/segment/d01`}
                  />
                ) : (<></>)
              }
            </div>
            <div className="col-span-6">
              {
                dataF01P1.length > 0 ? (
                  <TableComponent
                    title={`Data F01-P1`}
                    tableData={{
                      headers: headersTableF01P1Version2,
                      body: dataF01P1,
                    }}
                    isEditable={false}
                    viewMoreLink={`/validation-progress/p1/period/${period}/segment/f01`}
                  />
                ) : (<></>)
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TableErrorD01P01Component;
