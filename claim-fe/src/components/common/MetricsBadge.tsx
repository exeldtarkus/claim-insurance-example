import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import clsx from "clsx";

interface MetricsBadgeProps {
  type: "Up" | "Down" | "Nothing-Change";
  value?: number;
}

const MetricsBadge: React.FC<MetricsBadgeProps> = ({ type, value }) => {
  const baseStyle =
    "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";

  const typeConfig = {
    Up: {
      color: "bg-green-100 text-green-800",
      icon: <ArrowUpIcon className="w-3 h-3 mr-1 text-green-500" />,
      format: (v: number) => `+${v.toFixed(2)}%`,
    },
    Down: {
      color: "bg-red-100 text-red-800",
      icon: <ArrowDownIcon className="w-3 h-3 mr-1 text-red-500" />,
      format: (v: number) => `-${v.toFixed(2)}%`,
    },
    "Nothing-Change": {
      color: "bg-gray-100 text-gray-800",
      icon: null,
      format: () => "0.00%",
    },
  };

  const config = typeConfig[type];

  return (
    <span className={clsx(baseStyle, config.color)}>
      {config.icon}
      {value !== undefined ? config.format(value) : config.format(0)}
    </span>
  );
};

export default MetricsBadge;
