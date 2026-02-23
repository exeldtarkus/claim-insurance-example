// components/ProgressBars.tsx
import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number | null;
  label: string;
}

const ProgressBarOne: React.FC<ProgressBarProps> = ({ progress, label }) => {
  const [currentProgress, setCurrentProgress] = useState<number | null>(progress);

  useEffect(() => {
    if (progress !== null) {
      const interval = setInterval(() => {
        if (currentProgress !== progress) {
          setCurrentProgress(prev => (prev !== null ? Math.min(prev + 1, progress) : progress));
        } else {
          clearInterval(interval);
        }
      }, 20); // Update every 20ms for smooth transition
    }
  }, [progress, currentProgress]);

  return (
    <div className="space-y-3">
      {/* Progress Label */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-blue-600">{label}</span>
        <span className="text-xs font-medium text-blue-600">
          {progress !== null ? `${progress}%` : "In Progress..."}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div
        className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentProgress || 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {currentProgress === 0 ? (
          <div className="w-full h-2 bg-blue-600 rounded-full animate-slide" />
        ) : (
          <div
            className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500"
            style={{ width: `${currentProgress}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBarOne;
