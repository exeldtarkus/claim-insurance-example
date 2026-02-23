"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

export enum ESlikActionButtonHeaders {
  GenerateData = "Generate Data",
  SetValidation = "Set Validation",
  DataD01 = "Data D01",
  DataF01 = "Data F01",
  GenerateFile = "Generate File",
  DownloadGenerateFile = "Download Generate File",
  SelectedPeriod = "Selected Period",
  SelectedSegment = "Selected Segment",
  ButtonView = "View",
  SubmitValidation = "Submit Validation",
}

const buttons: ESlikActionButtonHeaders[] = [
  ESlikActionButtonHeaders.GenerateData,
  ESlikActionButtonHeaders.SetValidation,
  ESlikActionButtonHeaders.DataD01,
  ESlikActionButtonHeaders.DataF01,
  ESlikActionButtonHeaders.GenerateFile,
  ESlikActionButtonHeaders.DownloadGenerateFile,
  ESlikActionButtonHeaders.SubmitValidation,
];

type Props = {
  selectedPeriod: string;
  periodOptions: string[];
  selectedSegment: string | null;
  segmentOptions?: ["D01", "F01"];
  onPeriodChange: (val: React.ChangeEvent<HTMLSelectElement>) => void;
  onSegmentChange: (val: React.ChangeEvent<HTMLSelectElement>) => void;
  onView: () => void;
  onActionClick: (action: ESlikActionButtonHeaders, value: string) => void;
  disabledActions?: ESlikActionButtonHeaders[];
  hideAction?: ESlikActionButtonHeaders[];
};

const SlikMainHeader: React.FC<Props> = ({
  selectedPeriod,
  periodOptions = [],
  selectedSegment = null,
  segmentOptions = ["D01", "F01"],
  onPeriodChange,
  onSegmentChange,
  onView,
  onActionClick,
  disabledActions = [],
  hideAction = [],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formattedPeriodOptions = periodOptions.map((period) => ({
    label: period,
    value: period,
  }));

  const formattedSegmentOptions = segmentOptions.map((segment) => ({
    label: segment,
    value: segment,
  }));

  const resolveValue = (action: ESlikActionButtonHeaders): string => {
    if (action === ESlikActionButtonHeaders.SelectedPeriod) return selectedPeriod;
    if (action === ESlikActionButtonHeaders.SelectedSegment) return selectedSegment || "";
    return action;
  };

  const isActionDisabled = (action: ESlikActionButtonHeaders): boolean => {
    return disabledActions.includes(action);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-none mb-3">
      {/* Period Select */}
      {!hideAction.includes(ESlikActionButtonHeaders.SelectedPeriod) && (
        <div className="relative flex-1 min-w-[150px]">
          <Select
            id="selectedPeriod"
            options={formattedPeriodOptions}
            placeholder="Select period"
            value={selectedPeriod}
            onChange={onPeriodChange}
            className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
          />
          <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
            <ChevronDownIcon />
          </span>
        </div>
      )}

      {!hideAction.includes(ESlikActionButtonHeaders.SelectedSegment) && (
        <div className="relative flex-1 min-w-[150px] ml-2 mt-2 sm:mt-0">
          <Select
            id="selectedSegment"
            options={formattedSegmentOptions}
            placeholder="Select segment"
            value={selectedSegment || ""}
            onChange={onSegmentChange}
            className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
          />
          <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
            <ChevronDownIcon />
          </span>
        </div>
      )}

      {/* View button */}
      {!hideAction.includes(ESlikActionButtonHeaders.ButtonView) && (
        <Button size="sm" variant="outline" onClick={onView} className="ml-4 mt-2 sm:mt-0" disabled={disabledActions.includes(ESlikActionButtonHeaders.ButtonView)}>
          View
        </Button>
      )}

      {/* Desktop Actions */}
      <div className="hidden 2xl:flex gap-2 flex-wrap ml-auto justify-end">
        {buttons.map((action) =>
          hideAction.includes(action) ? null : (
            <Button
              key={action}
              size="sm"
              variant="outline"
              onClick={() => onActionClick(action, resolveValue(action))}
              disabled={isActionDisabled(action)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
            >
              {action}
            </Button>
          )
        )}
      </div>

      {/* Mobile Dropdown */}
      <div className="2xl:hidden relative w-full">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full text-left"
        >
          More Actions ▾
        </Button>

        {showDropdown && (
          <div className="absolute z-10 mt-2 w-full rounded-md shadow-lg">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md">
              {buttons.map((action) =>
                hideAction.includes(action) ? null : (
                  <button
                    key={action}
                    onClick={() => {
                      onActionClick(action, resolveValue(action));
                      setShowDropdown(false);
                    }}
                    disabled={isActionDisabled(action)}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlikMainHeader;
