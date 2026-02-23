import React, { useState } from "react";

interface EllipsisTextWithCopyProps {
  text: string;
  maxWidth?: string;
}

const EllipsisTextWithCopy: React.FC<EllipsisTextWithCopyProps> = ({
  text,
  maxWidth = "250px",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="flex items-center gap-2 group"
      style={{ maxWidth }}
      title={text}
    >
      <span className="truncate overflow-hidden whitespace-nowrap text-ellipsis flex-1">
        {text}
      </span>
      <button
        onClick={handleCopy}
        className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "✔" : "📋"}
      </button>
    </div>
  );
};

export default EllipsisTextWithCopy;
