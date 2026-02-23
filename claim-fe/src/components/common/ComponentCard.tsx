"use client";

import React from "react";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  viewMoreLink?: string; // Optional prop to control the visibility of the "View More" button
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
  onSaveChanges?: () => void; // Callback function for save changes
  isFixingValidation?: boolean; // Optional prop to indicate if fixing validation is enabled
  setFixingValidation?: () => void; // Callback function to set fixing validation state
  isSubmitValidation?: boolean; // Optional prop to indicate if submit validation is enabled
  onSubmitValidation?: () => void; // Callback function for submit validation
}

const ComponentCard: React.FC<ComponentCardProps> = (props) => {
  const {
    title,
    children,
    className = "",
    desc = "",
    viewMoreLink = "", // Optional prop to control the visibility of the "View More" button
    isSaveChanges = false, // Optional prop to indicate if save changes is enabled
    onSaveChanges = () => {}, // Callback function for save changes
    isFixingValidation = false, // Optional prop to indicate if fixing validation is enabled
    setFixingValidation,
    isSubmitValidation = false, // Optional prop to indicate if submit validation is enabled
    onSubmitValidation = () => {}, // Callback function for submit validation
  } = props;
  const router = useRouter();

  const handleRedirectPage = (link: string) => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >

      <div className="flex justify-between items-center mb-4">
        {/* Card Header */}
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        <div className="px-6 py-5 flex items-center space-x-2">

          {isSaveChanges && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSaveChanges}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
              disabled={true}
            >
              Apply All
            </Button>
          )}
          {isFixingValidation && (
            <Button
              size="sm"
              variant="outline"
              onClick={setFixingValidation}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
            >
              Fixing Validation
            </Button>
          )}
          {isSubmitValidation && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSubmitValidation}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:dark:bg-gray-600"
            >
              Submit Validation
            </Button>
          )}
          {viewMoreLink != "" && (
            <Button size="sm" variant="outline" onClick={() => handleRedirectPage(viewMoreLink)} className="ml-4 mt-2 sm:mt-0">
              View More
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
