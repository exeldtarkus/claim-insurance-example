"use client";
import useIsMobile from "@/hooks/useIsMobile";
import React from "react";
// import DataP1Section from "./sections/DataP1Section";
import DataP1SectionSample from "./sections/DataP1SectionSample";

interface ValidationErrorMainComponentProps {
  period: string;
  segment: string;
}

const ValidationErrorMainComponent: React.FC<ValidationErrorMainComponentProps> = (Props) => {

  const { period, segment } = Props;
  const isMobile = useIsMobile();
  // const [isGetDataP1, setIsGetDataP1] = useState(false);

  // useEffect(() => {
  //   setIsGetDataP1(true);
  // }, [period]);

  return (
    <div className={`flex ${isMobile ? "flex-col" : "flex-col"} space-y-6`}>
      <div className="col-span-6">
        {segment === "d01" && (
          <div className="col-span-6">
            <DataP1SectionSample
              period={period}
              segment="D01"
              isSaveChanges={true}
              isFixingValidation={true}
              isEditable={true}
            />
          </div>
        )}
        {segment === "f01" && (
          <div className="col-span-6">
            <DataP1SectionSample
              period={period}
              segment="F01"
              isSaveChanges={true}
              isFixingValidation={true}
              isEditable={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationErrorMainComponent;
