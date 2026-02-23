/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ClaimsService from "@/services/claims";
import InsuranceService, { IInsurance } from "@/services/insurance";

// 1. Komponen Isi Form (Child Component)
function DraftFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const insuranceId = searchParams.get("insurance_id");

  const user = useSelector((state: RootState) => state.user?.data);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    notes: ""
  });

  const [insuranceData, setInsuranceData] = useState<IInsurance | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (insuranceId) {
        try {
          // Asumsi API getById sudah kamu buat
          const allInsurances = await InsuranceService.getAllInsurances();
          const found = allInsurances.find((ins: IInsurance) => ins.uuid === insuranceId);
          if (found) setInsuranceData(found);
        } catch (error) {
          console.error("Gagal load detail asuransi:", error);
        }
      }
    };
    fetchDetail();
  }, [insuranceId]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insuranceId) return alert("ID Asuransi tidak valid.");
    if (!insuranceData?.amount) return alert("Data nominal asuransi belum termuat.");

    setIsProcessing(true);
    try {
      const payload = {
        insurance_id: insuranceId,
        total_amount: Number(insuranceData.amount),
      };

      const res = await ClaimsService.createDraft(payload);

      alert(`Berhasil! Klaim draft dibuat dengan ID: ${res.data?.id || "sukses"}`);
      router.push("/claims");

    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat membuat draf klaim.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => router.back();

  const inputClasses = "w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:text-white dark:focus:border-blue-500";
  const disabledClasses = "cursor-not-allowed bg-gray-100 dark:bg-gray-800";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-7 xl:p-10">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Form Pengajuan Klaim</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Periksa kembali data diri dan konfirmasi nominal klaim Anda.</p>
      </div>

      <form onSubmit={handleProcess} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
          <h4 className="mb-4 text-sm font-semibold uppercase text-gray-500">Data Asuransi Terpilih</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">ID Asuransi (UUID)</label>
              <input type="text" value={insuranceId || ""} disabled className={`${inputClasses} ${disabledClasses}`} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Asuransi</label>
              <input type="text" value={insuranceData?.insurance_type?.toUpperCase() || "MEMUAT..."} disabled className={`${inputClasses} ${disabledClasses}`} />
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase text-gray-500">Data Pemohon</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase text-gray-500">Detail Klaim</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nominal Klaim (IDR)</label>
              <input
                type="text"
                value={insuranceData?.amount ? insuranceData.amount.toLocaleString("id-ID") : "MEMUAT..."}
                disabled
                className={`${inputClasses} ${disabledClasses} font-semibold text-gray-900 dark:text-white`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan / Catatan</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Tuliskan rincian klaim anda di sini..." className={inputClasses} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
          <button type="button" onClick={handleCancel} disabled={isProcessing} className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            CANCEL
          </button>
          <button type="submit" disabled={isProcessing || !insuranceData} className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
            {isProcessing ? "MEMPROSES..." : "PROCESS"}
          </button>
        </div>
      </form>
    </div>
  );
}

// 2. MAIN COMPONENT EXPORT (Wajib ada `export default` untuk Next.js Pages)
export default function ClaimDraftPage() {
  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle="Buat Klaim (Draft)" />

      {/* Suspense wajib dipakai di Next.js saat kita menggunakan useSearchParams() */}
      <Suspense fallback={<div className="p-10 text-center animate-pulse text-gray-500">Memuat form klaim...</div>}>
        <DraftFormContent />
      </Suspense>
    </div>
  );
}
