"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/icons";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { useReviewData } from "@/hooks/useReviewData";
import { IOptions } from "@/interfaces/IOptions";

type HeaderContainerProps = {
    handleButtonClick: (typeButton: string, period: string) => void;
};

const HeaderContainer: React.FC<HeaderContainerProps> = ({handleButtonClick}) => {
  const { getDataOptionsPeriod } = useReviewData();
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [ optionsPeriod, setOptionsdPeriod] = useState<IOptions[]>([]);
  const isRun = useRef(false);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedPeriod(value);
  };

  const _handleButtonClick = (typeButton: string) => {
    if (selectedPeriod) {
      handleButtonClick(typeButton, selectedPeriod);
    }else {
      alert("Please select a period before viewing.");
    }
  };

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const fetchOptions = async () => {
      const options = await getDataOptionsPeriod();
      setOptionsdPeriod(options);
    };

    fetchOptions();
  });

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-6 mb-6">
      <div className="col-span-2">
        <div className="flex flex-row gap-4 items-center">
          <div className="relative">
            <Select
              id="selectedPeriod"
              options={optionsPeriod}
              placeholder="Select period"
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={()=>_handleButtonClick("view")}>
            View
          </Button>
        </div>
      </div>
      <div className="col-span-4 col-end-7">
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button size="sm" variant="outline">
            Generate Data
          </Button>
          <Button size="sm" variant="outline">
            Set Validation
          </Button>
          <Button size="sm" variant="outline">
            Data D01
          </Button>
          <Button size="sm" variant="outline">
            Data F01
          </Button>
          <Button size="sm" variant="outline">
            Generate File
          </Button>
          <Button size="sm" variant="outline">
            Donwload Generate File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderContainer;
