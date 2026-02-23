import React, { useEffect, useState } from "react";
import CardTableContainer from "@/components/common/CardTableContainer";
import SlikServices from "@/services/slik";

const headers  = [
  { id: "validasi", label: "Validasi Code" },
  { id: "validasiDeskripsi", label: "Validasi Deskripsi" },
  { id: "nomorCifDebitur", label: "Nomor CIF Debitur" },
  { id: "nomorRekeningFasilitas", label: "Nomor Rekening Fasilitas" },
  { id: "kodeSifatKreditatauPembiayaan", label: "Kode Sifat Kredit atau Pembiayaan" },
  { id: "kodeJenisKreditatauPembiayaan", label: "Kode Jenis Kredit atau Pembiayaan" },
  { id: "kodeAkadKreditatauAkadPembiayaan", label: "Kode Akad Kredit atau Akad Pembiayaan" },
  { id: "nomorAkadAwal", label: "Nomor Akad Awal" },
  { id: "tanggalAkadAwal", label: "Tanggal Akad Awal" },
  { id: "nomorAkadAkhir", label: "Nomor Akad Akhir" },
  { id: "tanggalAkadAkhir", label: "Tanggal Akad Akhir" },
  { id: "frekuensiPerpanjanganFasilitasKreditatauPembiayaan", label: "Frekuensi Perpanjangan Fasilitas Kredit atau Pembiayaan" },
  { id: "tanggalAwalKreditatauPembiayaan", label: "Tanggal Awal Kredit atau Pembiayaan" },
  { id: "tanggalMulai", label: "Tanggal Mulai" },
  { id: "tanggalJatuhTempo", label: "Tanggal Jatuh Tempo" },
  { id: "kodeKategoriDebitur", label: "Kode Kategori Debitur" },
  { id: "kodeJenisPenggunaan", label: "Kode Jenis Penggunaan" },
  { id: "kodeOrientasiPenggunaan", label: "Kode Orientasi Penggunaan" },
  { id: "kodeSektorEkonomi", label: "Kode Sektor Ekonomi" },
  { id: "kodeKabupatenatauKotaLokasiProyek", label: "Kode Kabupaten atau Kota Lokasi Proyek" },
  { id: "nilaiProyek", label: "Nilai Proyek" },
  { id: "kodeValuta", label: "Kode Valuta" },
  { id: "sukuBungaatauImbalan", label: "Suku Bunga atau Imbalan" },
  { id: "jenisSukuBungaatauImbalan", label: "Jenis Suku Bunga atau Imbalan" },
  { id: "kreditatauPembiayaanProgramPemerintah", label: "Kredit atau Pembiayaan Program Pemerintah" },
  { id: "asalKreditatauPembiayaanTakeover", label: "Asal Kredit atau Pembiayaan Takeover" },
  { id: "sumberDana", label: "Sumber Dana" },
  { id: "plafonAwal", label: "Plafon Awal" },
  { id: "plafon", label: "Plafon" },
  { id: "realisasiatauPencairanBulanBerjalan", label: "Realisasi atau Pencairan Bulan Berjalan" },
  { id: "denda", label: "Denda" },
  { id: "bakiDebet", label: "Baki Debet" },
  { id: "nilaiDalamMataUangAsal", label: "Nilai Dalam Mata Uang Asal" },
  { id: "kodeKualitasKreditatauPembiayaan", label: "Kode Kualitas Kredit atau Pembiayaan" },
  { id: "tanggalMacet", label: "Tanggal Macet" },
  { id: "kodeSebabMacet", label: "Kode Sebab Macet" },
  { id: "tunggakanPokok", label: "Tunggakan Pokok" },
  { id: "tunggakanBungaatauImbalan", label: "Tunggakan Bunga atau Imbalan" },
  { id: "jumlahHariTunggakan", label: "Jumlah Hari Tunggakan" },
  { id: "frekuensiTunggakan", label: "Frekuensi Tunggakan" },
  { id: "frekuensiRestrukturirasi", label: "Frekuensi Restrukturirasi" },
  { id: "tanggalRestrukturisasiAwal", label: "Tanggal Restrukturisasi Awal" },
  { id: "tanggalRestrukturisasiAkhir", label: "Tanggal Restrukturisasi Akhir" },
  { id: "kodeCaraRestrukturisasi", label: "Kode Cara Restrukturisasi" },
  { id: "kodeKondisi", label: "Kode Kondisi" },
  { id: "tanggalKondisi", label: "Tanggal Kondisi" },
  { id: "keterangan", label: "Keterangan" },
  { id: "kodeKantorCabang", label: "Kode Kantor Cabang" },
  { id: "operasiData", label: "Operasi Data" },
];

interface F01P1DataSectionProps {
  isGetData: boolean;
  period: string;
  onFetched: () => void;
  viewMoreLink?: string;
  isPaginated?: boolean;
  isEditable?: boolean;
  isSaveChanges?: boolean; // Optional prop to indicate if save changes is enabled
}

const F01P1DataSection: React.FC<F01P1DataSectionProps> = (Props) => {

  const {
    isGetData,
    period,
    onFetched,
    viewMoreLink = "",
    isPaginated = false,
    isEditable = false,
    isSaveChanges = false,
  } = Props;
  
  const [tableData, setTableData] = useState<{ headers: typeof headers; body: Record<string, string>[] }>({ headers, body: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    size: 5,
    page: 1,
    totalPages: 0,
    totalData: 0,
  });
  
  useEffect(() => {
    if (!isGetData || !period) return;
    setIsLoading(true);
    SlikServices.getDataP1({
      period: period,
      segment: "f01",
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
    onFetched();
  }, [isGetData, period, onFetched, pagination.size, pagination.page]);
  
  useEffect(() => {
    setIsLoading(true);
    SlikServices.getDataP1({
      period: period,
      segment: "f01",
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

  const onSaveChanges = () => {
    if (!isSaveChanges) return;
    // Implement save changes logic here
    console.log("Save changes clicked", tableData.body);
  };
  
  return (
    <div className="col-span-6">
      <CardTableContainer
        title="Data F01-P1"
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
        onBodyChange={(newBody: Record<string, string>[]) => setTableData((prev) => ({ ...prev, body: newBody }))}
        isSaveChanges={isSaveChanges}
        onSaveChanges={onSaveChanges}
      />
    </div>
  );
};

export default F01P1DataSection;