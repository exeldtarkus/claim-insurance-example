import React, { useEffect, useRef, useState } from "react";
import CardTableContainer from "@/components/common/CardTableContainer";
import SlikServices from "@/services/slik";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import Select from "@/components/form/Select";
import MasterValidationServices from "@/services/masterValidation";
import { IMasterValidationResponse } from "@/interfaces/IMasterValidationService";
import { headersTableD01P1, headersTableF01P1 } from "./HeaderBodyTable";
import { ISlikSetValueP1Payload } from "@/interfaces/ISlikService";
import { showAlert } from "@/utils/showAlert";
import Checkbox from "@/components/form/input/Checkbox";
// import { TableData } from "@/interfaces/ITableData";


interface DataP1SectionProps {
  isGetData: boolean;
  period: string;
  segment: string;
  onFetched: () => void;
  viewMoreLink?: string;
  isPaginated?: boolean;
  isEditable?: boolean;
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
  isFixingValidation?: boolean; // Optional prop to indicate if fixing validation is enabled
  isSubmitValidation?: boolean; // Optional prop to indicate if submit validation is enabled
  onSubmitValidation?: () => void; // Callback function for submit validation
}

const DataP1Section : React.FC<DataP1SectionProps> = (Props) => {

  const {
    isGetData,
    period,
    segment,
    onFetched,
    viewMoreLink = "",
    isPaginated = false,
    isEditable = false,
    isSaveChanges = false,
    isFixingValidation = false, // Optional prop to indicate if fixing validation is enabled
    isSubmitValidation = false, // Optional prop to indicate if submit validation is enabled
    onSubmitValidation = () => {}, // Callback function for submit validation
  } = Props;

  const headers  = segment === "D01" ? headersTableD01P1 : headersTableF01P1;
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  // const [originalBody, setOriginalBody] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(true);
  const isFirstRender = useRef(true);
  const [isLoadingValidationCodeP1, setIsLoadingValidationCodeP1] = useState(false);
  const [pagination, setPagination] = useState({
    size: 5,
    page: 1,
    totalPages: 0,
    totalData: 0,
  });
  // const [dataChanged, setDataChanged] = useState<Record<string, string>[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [inputValueForm, setInputValueForm] = useState({
    errorCode: "",
    fixedValue: "",
    errorCodeDescription: "",
    fixedValueDisabled: false,
    errorCodeOptions: [] as string[],
  });
  const { errorCode, fixedValue, errorCodeDescription, fixedValueDisabled,  errorCodeOptions } = inputValueForm;
  const [savedData, setSavedData] = useState<Record<string, string>[]>([]);

  const formattedValidationCodeOptions = errorCodeOptions.map((item) => ({
    label: item,
    value: item,
  }));

  useEffect(() => {
    if (!isGetData || !period) return;
    // setIsLoading(true);
    getData();
    if (isFixingValidation) {
      getValidationCodeP1();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetData, period, onFetched, pagination.size, pagination.page, isFixingValidation, headers, segment]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip on first render
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    const fetchMasterValidation = async () => {
      if (errorCode !== "") {
        const masterValidation: IMasterValidationResponse = await MasterValidationServices.getMasterValidationByErrorCode({ errorCode: errorCode });
        handleInputValueFormChange({
          errorCodeDescription: `${masterValidation.validation} at ${masterValidation.column}`,
          fixedValueDisabled: masterValidation.editable
        });
      }
    };
    fetchMasterValidation();
  }, [errorCode]);

  const getData = () => {
    setIsLoading(true);
    SlikServices.getDataP1({
      period: period,
      segment: segment,
      size: pagination.size.toString(),
      page: pagination.page.toString(),
    })
      .then(async (data) => {
        // setOriginalBody(data.items);
        setTableData({ headers, body: data.items });
        setPagination((prev) => {
          return {
            ...prev,
            size: pagination.size,
            page: pagination.page,
            totalPages: Number(data.totalPage),
            totalData: Number(data.totalData),
          };
        });
      })
      .finally(() => {
        setIsLoading(false);
        onFetched();
      });
  };

  const getValidationCodeP1 = () => {
    setIsLoadingValidationCodeP1(true);
    SlikServices.getValidationCodeP1({
      period,
      segment: segment,
    })
      .then((lsValidationCode) => {
        handleInputValueFormChange({ errorCodeOptions: lsValidationCode });
      })
      .finally(() => setIsLoadingValidationCodeP1(false));
  };

  const handleInputValueFormChange = (dataParam: Record<string, string | string[] | boolean>) => {
    setInputValueForm((prev) => ({
      ...prev,
      ...dataParam
    }));
  };

  const onBodyChange = (newBody: Record<string, string>[]) => {
    // setTableData((prev) => ({
    //   ...prev,
    //   body: newBody,
    // }));
    // setDataChanged([]); // Reset changes when body is changed

    // // Find changed rows
    // for ( let i = 0; i < newBody.length; i++) {
    //   const row = newBody[i];
    //   const originalRow = originalBody.find(
    //     (o) => o.nomorCifDebitur === row.nomorCifDebitur
    //   );
    //   if (!originalRow) continue; // Skip if row is new

    //   // Check if any field has changed

    //   const fieldChanged = Object.keys(row).filter(
    //     (key) => {
    //       if (key === "nomorCifDebitur") return true; // nomorCifDebitur
    //       return row[key] !== originalRow[key];
    //     }
    //   );
    //   if (fieldChanged.length > 1) {
    //     const valueChanged = fieldChanged.map((key) => ({
    //       [key]: row[key],
    //     }));
    //     const rowWithChanges = Object.assign({}, ...valueChanged);
    //     setDataChanged((prev) => {
    //       const existingIndex = prev.findIndex(
    //         (item) => item.nomorCifDebitur === rowWithChanges.nomorCifDebitur
    //       );
    //       if (existingIndex !== -1) {
    //         // Replace the existing object
    //         const updated = [...prev];
    //         updated[existingIndex] = rowWithChanges;
    //         return updated;
    //       }
    //       // Add new object
    //       return [...prev, rowWithChanges];
    //     });
    //   }
    // }
    setSavedData(newBody);
  };

  const onSaveChanges = async () => {
    // if (!isSaveChanges) return;
    // Implement save changes logic here
    if (savedData.length === 0) {
      console.log("No changes to save");
      return;
    }
    // console.log("Save changes clicked", JSON.stringify(dataChanged));
    // ready to submit into backend
    const dataPost:ISlikSetValueP1Payload = {
      period: period,
      segment: segment,
      dataP1: savedData
    };
    const response = await SlikServices.updateDataP1(dataPost);
    if (response?.message) {
      showAlert({
        title: "success!",
        text: response?.message ?? "",
        icon: "success",
        confirmButtonText: "Close",
      });
      getData();
      getValidationCodeP1();
    }

  };

  const handeExecute = async () => {
    if (!isEditable) return;
    if (!errorCode || (!fixedValue && !isAutoFixing)) return;

    // ready to submit into backend
    const dataPost: ISlikSetValueP1Payload = {
      period: period,
      segment: segment,
      errorCode: errorCode,
    };
    if (!isAutoFixing) {
      dataPost.fixedValue = fixedValue;
    }
    const response = await SlikServices.updateDataP1ByErrorCode(dataPost);
    if (response?.message) {
      closeModal();
      showAlert({
        title: "success!",
        text: response?.message ?? "",
        icon: "success",
        confirmButtonText: "Close",
      });
      getData();
      getValidationCodeP1();
    }
  };

  const hangeChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputValueForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onValidationCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInputValueForm((prev)=>({
      ...prev,
      errorCode: val,
      fixedValue: "",
    }));
  };

  // console.log("dataChanged", dataChanged);

  return (
    <div className="col-span-6">
      {tableData.body.length > 0 && (
        <CardTableContainer
          title={`Data ${segment}-P1`}
          desc="Error Validation"
          tableData={tableData}
          isLoading={isLoading}
          viewMoreLink={tableData.body.length > 0 ? viewMoreLink : ""}
          isPaginated={isPaginated}
          pagination={{
            page: pagination.page,
            size: pagination.size,
            totalPages: pagination.totalPages,
            totalData: pagination.totalData,
            onPageChange: (page: number) => setPagination((prev) => {
              return {
                ...prev,
                page: page,
              };
            }),
            onSizeChange: (size: number) => setPagination((prev) => {
              return {
                ...prev,
                size: size,
              };
            }),
          }}
          isEditable={false}
          onBodyChange={onBodyChange}
          isSaveChanges={isSaveChanges}
          onSaveChanges={onSaveChanges}
          isFixingValidation={isFixingValidation} // Enable fixing validation
          setFixingValidation={() => openModal()}
          isSubmitValidation={isSubmitValidation} // Enable submit validation
          onSubmitValidation={onSubmitValidation} // Callback function for submit validation
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Form Fixing Validation
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <Label>Validasi Code</Label>
              {isLoadingValidationCodeP1 ? (
                <div role="status" className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded-[20px] dark:bg-gray-700 mb-2.5"></div>
                </div>
              ) : (
                <div className="relative flex-1 min-w-[150px]">
                  <Select
                    id="errorCode"
                    options={formattedValidationCodeOptions}
                    placeholder="Select validation code"
                    value={errorCode}
                    onChange={onValidationCodeChange}
                    className="dark:bg-dark-900 dark:text-white dark:border-gray-600 border-gray-300 w-28"
                  />
                  <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                    <ChevronDownIcon />
                  </span>
                </div>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2">
              { (errorCodeDescription) && (
                <Label>Catatan: {errorCodeDescription}</Label>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
              <Checkbox
                checked={isAutoFixing}
                onChange={()=>setIsAutoFixing(!isAutoFixing)}
                label="Auto Fixing"
                id="isAutoFixing"
              />
            </div>
            {!isAutoFixing && (
              <>
                <div className="col-span-1 sm:col-span-2">
                  <Label>Set Fixed Value</Label>
                  <Input type="text" placeholder="Default Value" id="fixedValue" value={fixedValue} onChange={hangeChangeValue} disabled={!fixedValueDisabled}/>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  { (!fixedValueDisabled && errorCodeDescription) && (
                    <Label>cannot be implemented in this feature.</Label>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handeExecute} className="bg-brand-500 text-white hover:bg-brand-600" disabled={!fixedValueDisabled && !isAutoFixing}>
              Execute
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default DataP1Section;
