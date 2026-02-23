/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import TableComponent from "@/components/tables/TableComponent";
import SlikServices from "@/services/slik";
import { headersTableD01P1Version2, headersTableF01P1Version2 } from "./HeaderBodyTable";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import { ChevronDownIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { showAlert } from "@/utils/showAlert";
import { ISlikSetValueP1Payload } from "@/interfaces/ISlikService";
import Input from "@/components/form/input/InputField";
import { IMasterValidationResponse } from "@/interfaces/IMasterValidationService";
import MasterValidationServices from "@/services/masterValidation";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { findErrorMapValidation } from "@/utils/MapErrorCodesValidation";

interface DataP1SectionSampleProps {
  period: string;
  segment: string;
  viewMoreLink?: string;
  isEditable?: boolean;
  isSaveChanges?: boolean;
  isFixingValidation?: boolean;
}

const DataP1SectionSample: React.FC<DataP1SectionSampleProps> = (props) => {
  const {
    period,
    segment,
    viewMoreLink = "",
    isEditable = false,
    isSaveChanges = false,
    isFixingValidation = false,
  } = props;
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoadingValidationCodeP1, setIsLoadingValidationCodeP1] = useState(false);
  const [dataChanges, setDataChanges] = useState<Record<string, string | number>[]>([]);
  const [inputValueForm, setInputValueForm] = useState({
    errorCode: "",
    fixedValue: "",
    errorCodeDescription: "",
    fixedValueDisabled: false,
    errorCodeOptions: [] as string[],
    isLoadingExecute: false,
  });
  const { errorCode, fixedValue, errorCodeDescription, fixedValueDisabled,  errorCodeOptions, isLoadingExecute } = inputValueForm;
  const [isAutoFixing, setIsAutoFixing] = useState(true);

  useEffect(() => {
    fetchData(page, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, period, segment]);

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

  const fetchData = async (currentPage: number, pageSize: number) => {
    setIsLoading(true);
    try {
      const dataSlik = await SlikServices.getDataP1({
        period,
        segment,
        size: pageSize.toString(),
        page: currentPage.toString(),
      });

      dataSlik.items = dataSlik.items.map((item: any) => {
        const findValidasiErrorMaps = findErrorMapValidation(item?.validasi?.split(",") || []).map(item => item.v_column);
        const errorMapsValidasiUnique = findValidasiErrorMaps.length > 0 ? [...new Set(findValidasiErrorMaps)] : [];
        if (errorMapsValidasiUnique.length > 0) {
          return {
            ...item,
            coloredCells: errorMapsValidasiUnique
          };
        }
        return item;
      });

      console.log("dataSlik", dataSlik.items);

      setData(dataSlik.items);
      setOriginalData(dataSlik.items);
      setTotalData(Number(dataSlik.totalData));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const formattedValidationCodeOptions = errorCodeOptions.map((item) => ({
    label: item,
    value: item,
  }));

  const handleBodyChange = (changes: Record<string, string | number>[]) => {
    // console.log("Data changes in TableComponent:", changes);
    setDataChanges(changes);
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

  const onSaveChanges = async () => {
    // // Implement save changes logic here
    if (dataChanges.length === 0) {
      showAlert({
        title: "No changes",
        text: "There are no changes to save.",
        icon: "info",
        confirmButtonText: "Close",
      });
      return;
    }
    // // ready to submit into backend
    const dataPost:ISlikSetValueP1Payload = {
      period: period,
      segment: segment,
      dataP1: dataChanges
    };
    try {
      const response = await SlikServices.updateDataP1(dataPost);
      if (response?.message === "data is updated!") {
        showAlert({
          title: "success!",
          text: response?.message ?? "",
          icon: "success",
          confirmButtonText: "Close",
        });
        fetchData(page, size);
        // getValidationCodeP1();
      }else {
        showAlert({
          title: "failed!",
          text: response?.message ?? "",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      showAlert({
        title: "Error",
        text: "Failed to save changes. Please try again.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }

  };

  const handeExecute = async () => {
    if (!isEditable) return;
    if (!errorCode || (!fixedValue && !isAutoFixing)) return;
    setInputValueForm((prev) => ({
      ...prev,
      isLoadingExecute: true,
    }));

    // ready to submit into backend
    const dataPost: ISlikSetValueP1Payload = {
      period: period,
      segment: segment,
      errorCode: errorCode,
    };
    console.log("handeExecute : ", dataPost);
    if (!isAutoFixing) {
      dataPost.fixedValue = fixedValue;
    }
    const response = await SlikServices.updateDataP1ByErrorCode(dataPost);

    closeModal();
    fetchData(page, size);
    getValidationCodeP1();
    setInputValueForm((prev) => ({
      ...prev,
      isLoadingExecute: false,
    }));

    if (response?.status === 200) {
      showAlert({
        title: "success!",
        text: response?.message ?? "",
        icon: "success",
        confirmButtonText: "Close",
      });
      return;
    }
    showAlert({
      title: "failed!",
      text: response?.message ?? "",
      icon: "error",
      confirmButtonText: "Close",
    });
    return;
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

  const openModalFixValidation = () => {
    openModal();
    if (isFixingValidation) {
      getValidationCodeP1();
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Data ${segment}-P1
          </h3>
        </div>
        <div role="status" className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-6 space-y-6">
      {/* TableComponent */}
      {data.length > 0 ? (
        <TableComponent
          title={`Data ${segment}-P1`}
          tableData={{
            headers: segment === "D01" ? headersTableD01P1Version2 : headersTableF01P1Version2,
            body: data,
          }}
          tableDataOriginal={originalData}
          isEditable={isEditable}
          onBodyChange={handleBodyChange}
          rowsPerPage={size}
          pagination={{
            page,
            size,
            totalData,
            onPageChange: (newPage: number) => setPage(newPage),
            onSizeChange: (newSize: number) => setSize(newSize),
          }}
          viewMoreLink={viewMoreLink}
          isSaveChanges={isSaveChanges}
          isFixingValidation={isFixingValidation}
          onSaveChanges={onSaveChanges}
          setFixingValidation={() => openModalFixValidation()}
        />
      ): (<></>)}
      <Modal
        isOpen={isOpen}
        onClose={()=>{if(!isLoadingExecute) {closeModal();}}}
        className="max-w-[584px] p-5 lg:p-10"
        disableBackdropClick={true}
        disableEscClose={true}
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
            {isLoadingExecute && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Do not close this page, this may take a longger...</span>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={()=>{if(!isLoadingExecute) {closeModal();}}}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={handeExecute}
              className="bg-brand-500 text-white hover:bg-brand-600"
              disabled={(!fixedValueDisabled && !isAutoFixing) || isLoadingExecute}
            >
              {isLoadingExecute ? (
                <LoadingSpinner/>
              ) : (
                "Execute"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DataP1SectionSample;
