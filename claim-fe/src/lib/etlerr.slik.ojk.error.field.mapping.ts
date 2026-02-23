export type FieldMap<T extends string> = {
  [K in T]: string | null;
};

export const d01ErrorFieldOjkSlik = [
  "Nomor_CIF_Debitur", "Jenis_Identitas", "Nomor_Identitas", "Nama_Sesuai_Identitas", "Nama_Lengkap",
  "Kode_Status_Pendidikan_atau_Gelar_Debitur", "Jenis_Kelamin", "Tempat_Lahir", "Tanggal_Lahir",
  "Nomor_Pokok_Wajib_Pajak", "Alamat", "Kelurahan", "Kecamatan", "Kode_Kabupaten_atau_Kota",
  "Kode_Pos", "Nomor_Telepon", "Nomor_Telepon_Seluler", "Alamat_Surat_Elektronik",
  "Kode_Negara_Domisili", "Kode_Pekerjaan", "Tempat_Bekerja", "Kode_Bidang_Usaha_Tempat_Bekerja",
  "Alamat_Tempat_Bekerja", "Penghasilan_Kotor_Pertahun", "Kode_Sumber_Penghasilan",
  "Jumlah_Tanggungan", "Kode_Hubungan_Dengan_Pelapor", "Kode_Golongan_Debitur",
  "Status_Perkawinan_Debitur", "Nomor_Identitas_Pasangan", "Nama_Pasangan", "Tanggal_Lahir_Pasangan",
  "Perjanjian_Pisah_Harta", "Melanggar_BMPK_BMPD_BMPP", "Melampaui_BMPK_BMPD_BMPP",
  "Nama_Gadis_Ibu_Kandung", "Kode_Kantor_Cabang", "Operasi_Data"
] as const;

export const f01ErrorFieldOjkSlik = [
  "Nomor_Rekening_Fasilitas", "Nomor_CIF_Debitur", "Kode_Sifat_Kredit_atau_Pembiayaan",
  "Kode_Jenis_Kredit_atau_Pembiayaan", "Kode_Akad_Kredit_atau_Akad_Pembiayaan",
  "Nomor_Akad_Awal", "Tanggal_Akad_Awal", "Nomor_Akad_Akhir", "Tanggal_Akad_Akhir",
  "Frekuensi_Perpanjangan_Fasilitas_Kredit_atau_Pembiayaan", "Tanggal_Awal_Kredit_atau_Pembiayaan",
  "Tanggal_Mulai", "Tanggal_Jatuh_Tempo", "Kode_Kategori_Debitur", "Kode_Jenis_Penggunaan",
  "Kode_Orientasi_Penggunaan", "Kode_Sektor_Ekonomi", "Kode_Kabupaten_atau_Kota_Lokasi_Proyek",
  "Nilai_Proyek", "Kode_Valuta", "Suku_Bunga_atau_Imbalan", "Jenis_Suku_Bunga_atau_Imbalan",
  "Kredit_atau_Pembiayaan_Program_Pemerintah", "Asal_Kredit_atau_Pembiayaan_Takeover",
  "Sumber_Dana", "Plafon_Awal", "Plafon", "Realisasi_atau_Pencairan_Bulan_Berjalan",
  "Denda", "Baki_Debet", "Nilai_Dalam_Mata_Uang_Asal", "Kode_Kualitas_Kredit_atau_Pembiayaan",
  "Tanggal_Macet", "Kode_Sebab_Macet", "Tunggakan_Pokok", "Tunggakan_Bunga_atau_Imbalan",
  "Jumlah_Hari_Tunggakan", "Frekuensi_Tunggakan", "Frekuensi_Restrukturirasi",
  "Tanggal_Restrukturisasi_Awal", "Tanggal_Restrukturisasi_Akhir", "Kode_Cara_Restrukturisasi",
  "Kode_Kondisi", "Tanggal_Kondisi", "Keterangan", "Kode_Kantor_Cabang", "Operasi_Data"
] as const;

export interface IEtlErrorRecordD01 extends FieldMap<typeof d01ErrorFieldOjkSlik[number]> {
  Error_Code?: string;
  Error_Message?: string;
}

export interface IEtlErrorRecordF01 extends FieldMap<typeof f01ErrorFieldOjkSlik[number]> {
  Error_Code?: string;
  Error_Message?: string;
}

export type SupportedSegment = "D01" | "F01";

export function getFieldMapBySegment(segment: SupportedSegment): readonly string[] {
  switch (segment) {
  case "D01":
    return d01ErrorFieldOjkSlik;
  case "F01":
    return f01ErrorFieldOjkSlik;
  default:
    return [];
  }
}

