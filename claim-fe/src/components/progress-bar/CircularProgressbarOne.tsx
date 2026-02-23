import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressBarOneProps {
  progress: number;
  label: string;
}

const CircularProgressBarOne: React.FC<CircularProgressBarOneProps> = ({ progress, label }) => {
  const [isLoading, setIsLoading] = useState<boolean>(progress === 0);

  useEffect(() => {
    if (progress === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [progress]);

  return (
    <div className="relative flex flex-col items-center justify-center w-32 h-32">
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          pathColor: "#4caf50",
          textColor: "#4caf50",
          trailColor: progress === 0 ? "#d6d6d6" : "#f3f4f6",
          backgroundColor: "#f3f4f6",
          pathTransitionDuration: progress === 0 ? 1 : 0.5,
        })}
        strokeWidth={10}
      />

      {isLoading && (
        <div className="absolute w-20 h-20 border-t-8 border-t-blue-500 border-r-8 border-r-transparent border-b-8 border-b-transparent border-l-8 border-l-transparent rounded-full animate-spin-slow"></div>
      )}

      <span className="absolute bottom-0 text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-md mt-2">
        {label}
      </span>
    </div>
  );
};

export default CircularProgressBarOne;
