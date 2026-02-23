import React, { useEffect, useState } from "react";
import CardTableContainer from "@/components/common/CardTableContainer";
import SlikServices from "@/services/slik";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
// import { TableData } from "@/interfaces/ITableData";

const headers  = [
  { id: "validasi", label: "Validasi Code" },
  { id: "validasiDeskripsi", label: "Validasi Deskripsi" },
  { id: "nomorCifDebitur", label: "Nomor CIF Debitur" },
  { id: "jenisIdentitas", label: "Jenis Identitas" },
  { id: "nomorIdentitas", label: "Nomor Identitas" },
  { id: "namaSesuaiIdentitas", label: "Nama Sesuai Identitas" },
  { id: "namaLengkap", label: "Nama Lengkap" },
  { id: "kodeStatusPendidikanatauGelarDebitur", label: "Kode Status Pendidikan atau Gelar Debitur" },
  { id: "jenisKelamin", label: "Jenis Kelamin" },
  { id: "tempatLahir", label: "Tempat Lahir" },
  { id: "tanggalLahir", label: "Tanggal Lahir" },
  { id: "nomorPokokWajibPajak", label: "Nomor Pokok Wajib Pajak" },
  { id: "alamat", label: "Alamat" },
  { id: "kelurahan", label: "Kelurahan" },
  { id: "kecamatan", label: "Kecamatan" },
  { id: "kodeKabupatenatauKota", label: "Kode Kabupaten atau Kota" },
  { id: "kodePos", label: "Kode Pos" },
  { id: "nomorTelepon", label: "Nomor Telepon" },
  { id: "nomorTeleponSeluler", label: "Nomor Telepon Seluler" },
  { id: "alamatSuratElektronik", label: "Alamat Surat Elektronik" },
  { id: "kodeNegaraDomisili", label: "Kode Negara Domisili" },
  { id: "kodePekerjaan", label: "Kode Pekerjaan" },
  { id: "tempatBekerja", label: "Tempat Bekerja" },
  { id: "kodeBidangUsahaTempatBekerja", label: "Kode Bidang Usaha Tempat Bekerja" },
  { id: "alamatTempatBekerja", label: "Alamat Tempat Bekerja" },
  { id: "penghasilanKotorPertahun", label: "Penghasilan Kotor Pertahun" },
  { id: "kodeSumberPenghasilan", label: "Kode Sumber Penghasilan" },
  { id: "jumlahTanggungan", label: "Jumlah Tanggungan" },
  { id: "kodeHubunganDenganPelapor", label: "Kode Hubungan Dengan Pelapor" },
  { id: "kodeGolonganDebitur", label: "Kode Golongan Debitur" },
  { id: "statusPerkawinanDebitur", label: "Status Perkawinan Debitur" },
  { id: "nomorIdentitasPasangan", label: "Nomor Identitas Pasangan" },
  { id: "namaPasangan", label: "Nama Pasangan" },
  { id: "tanggalLahirPasangan", label: "Tanggal Lahir Pasangan" },
  { id: "perjanjianPisahHarta", label: "Perjanjian Pisah Harta" },
  { id: "melanggarBMPKBMPDBMPP", label: "Melanggar BMPK BMPD BMPP" },
  { id: "melampauiBMPKBMPDBMPP", label: "Melampaui BMPK BMPD BMPP" },
  { id: "namaGadisIbuKandung", label: "Nama Gadis Ibu Kandung" },
  { id: "kodeKantorCabang", label: "Kode Kantor Cabang" },
  { id: "operasiData", label: "Operasi Data" },
];

interface D01P1DataSectionProps {
  isGetData: boolean;
  period: string;
  onFetched: () => void;
  viewMoreLink?: string;
  isPaginated?: boolean;
  isEditable?: boolean;
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
  isFixingValidation?: boolean; // Optional prop to indicate if fixing validation is enabled
}

const D01P1DataSection : React.FC<D01P1DataSectionProps> = (Props) => {

  const {
    isGetData,
    period,
    onFetched,
    viewMoreLink = "",
    isPaginated = false,
    isEditable = false,
    isSaveChanges = false,
    isFixingValidation = false, // Optional prop to indicate if fixing validation is enabled
  } = Props;

  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  const [originalBody, setOriginalBody] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    size: 5,
    page: 1,
    totalPages: 0,
    totalData: 0,
  });
  const [dataChanged, setDataChanged] = useState<Record<string, string>[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [inputValueForm, setInputValueForm] = useState({
    validasiCode: "",
    defaultValue: "",
  });
  const { validasiCode, defaultValue } = inputValueForm;
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    SlikServices.getDataP1({
      period: period,
      segment: "d01",
      size: pagination.size.toString(),
      page: pagination.page.toString(),
    })
      .then((data) => {
        setTableData({ headers, body: data.items });
        setOriginalBody(data.items);
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
      .finally(() => setIsLoading(false));
    onFetched();
  }, [isGetData, period, onFetched, pagination.size, pagination.page]);

  useEffect(() => {
    setIsLoading(true);
    SlikServices.getDataP1({
      period: period,
      segment: "d01",
      size: pagination.size.toString(),
      page: pagination.page.toString(),
    })
      .then((data) => {
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
      .finally(() => setIsLoading(false));
  }, [pagination.page, pagination.size, period]);

  const onBodyChange = (newBody: Record<string, string>[]) => {
    setTableData((prev) => ({
      ...prev,
      body: newBody,
    }));
    setDataChanged([]); // Reset changes when body is changed
    
    // Find changed rows
    for ( let i = 0; i < newBody.length; i++) {
      const row = newBody[i];
      const originalRow = originalBody.find(
        (o) => o.nomorCifDebitur === row.nomorCifDebitur
      );
      if (!originalRow) continue; // Skip if row is new
      
      // Check if any field has changed
      
      const fieldChanged = Object.keys(row).filter(
        (key) => {
          if (key === "nomorCifDebitur") return true; // nomorCifDebitur
          return row[key] !== originalRow[key];
        }
      );
      if (fieldChanged.length > 1) {
        const valueChanged = fieldChanged.map((key) => ({
          [key]: row[key],
        }));
        const rowWithChanges = Object.assign({}, ...valueChanged);
        setDataChanged((prev) => {
          const existingIndex = prev.findIndex(
            (item) => item.nomorCifDebitur === rowWithChanges.nomorCifDebitur
          );
          if (existingIndex !== -1) {
            // Replace the existing object
            const updated = [...prev];
            updated[existingIndex] = rowWithChanges;
            return updated;
          }
          // Add new object
          return [...prev, rowWithChanges];
        });
      }
    }
  };

  const onSaveChanges = () => {
    // if (!isSaveChanges) return;
    // Implement save changes logic here
    if (dataChanged.length === 0) {
      console.log("No changes to save");
      return;
    }
    console.log("Save changes clicked", dataChanged);
    // ready to submit into backend
  };

  const handeExecute = () => {
    if (!isEditable) return;
    if (!validasiCode || !defaultValue) return;
    console.log("Execute fixing validation with", {
      validasiCode,
      defaultValue,
    });
  };

  const hangeChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputValueForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  
  return (
    <div className="col-span-6">
      <CardTableContainer
        title="Data D01-P1"
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
        isEditable={isEditable}
        onBodyChange={onBodyChange}
        isSaveChanges={isSaveChanges}
        onSaveChanges={onSaveChanges}
        isFixingValidation={isFixingValidation} // Enable fixing validation
        setFixingValidation={() => openModal()}
      />
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
              <Input type="text" placeholder="Validasi Code" id="validasiCode" value={validasiCode} onChange={hangeChangeValue}/>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Label>Set Default Value</Label>
              <Input type="text" placeholder="Default Value" id="defaultValue" value={defaultValue} onChange={hangeChangeValue}/>
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handeExecute} className="bg-brand-500 text-white hover:bg-brand-600">
              Execute
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default D01P1DataSection;