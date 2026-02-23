// LoadingAnimatePulse.tsx
import React from "react";

interface LoadingAnimatePulseProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

const LoadingAnimatePulse: React.FC<LoadingAnimatePulseProps> = ({
  height = "h-6",
  width = "w-24",
  borderRadius = "rounded-[20px]",
}) => {
  return (
    <div role="status" className="animate-pulse">
      <div
        className={`${height} ${width} ${borderRadius} bg-gray-200 dark:bg-gray-700 mb-2.5`}
      ></div>
    </div>
  );
};

export default LoadingAnimatePulse;
