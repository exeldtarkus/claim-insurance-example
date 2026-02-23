import React from "react";

interface HeaderTitleProps {
  label?: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  label = "",
}) => {

  return (
    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
      {label}
    </h3>
  );
};

export default HeaderTitle;
