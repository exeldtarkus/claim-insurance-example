/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ClaimsService from "@/services/claims";

export default function UserClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const user = useSelector((state: RootState) => state.user?.data);

  // State Data
  const [claim, setClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Detail Klaim
  const fetchClaimDetail = async () => {
    try {
      setIsLoading(true);
      const res = await ClaimsService.getClaimById(id);
      setClaim(res.data);
    } catch (error) {
      console.error("Gagal mengambil detail klaim:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) fetchClaimDetail();
  }, [user, id]);

  // 2. Handle Submit Klaim (Draft -> Submitted)
  const handleSubmitClaim = async () => {
    if (!confirm("Apakah Anda yakin ingin mengajukan klaim ini? Status tidak dapat diubah kembali ke Draft.")) return;

    try {
      setIsSubmitting(true);
      await ClaimsService.submitClaim(id);
      alert("Klaim berhasil diajukan!");
      fetchClaimDetail(); // Refresh data untuk melihat perubahan status
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengajukan klaim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (user?.role.toLowerCase() !== "user") {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Akses Ditolak. Halaman ini khusus untuk pemohon (User).
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!claim) {
    return <div className="p-10 text-center">Data klaim tidak ditemukan.</div>;
  }

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle={`Detail Klaim #${claim.id}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Panel Informasi Klaim</h2>
            <p className="mt-1 text-sm text-gray-500">ID Referensi Asuransi: {claim.insurance_id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase
              ${claim.status === "draft" ? "bg-gray-100 text-gray-600 dark:bg-gray-700" : ""}
              ${claim.status === "submitted" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30" : ""}
              ${claim.status === "reviewed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30" : ""}
              ${claim.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30" : ""}
            `}>
              {claim.status}
            </span>
            <button onClick={() => router.back()} className="text-sm font-medium text-gray-500 hover:text-blue-600 transition">
              Kembali
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nama Pemohon</label>
              <p className="text-lg font-medium text-gray-800 dark:text-white">{claim.user?.name || "TEST"}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Terdaftar</label>
              <p className="text-gray-600 dark:text-gray-300">{claim.user?.email || user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Nominal Klaim</label>
              <p className="text-2xl font-bold text-blue-600">{formatRupiah(claim.total_amount)}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Versi Dokumen</label>
              <p className="text-gray-600 dark:text-gray-300">v.{claim.version}</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-10 border-t border-gray-100 pt-8 dark:border-gray-800">
          {claim.status === "draft" ? (
            <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/10">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="max-w-md">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300">Siap untuk mengajukan?</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">Klaim Anda saat ini masih berstatus Draft. Klik tombol di samping untuk mengirimkan klaim ke tim verifikator.</p>
                </div>
                <button
                  onClick={handleSubmitClaim}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? "MEMPROSES..." : "SUBMIT KLAIM SEKARANG"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 italic">
              Klaim ini sudah diajukan dan sedang dalam tahap {claim.status}. Anda tidak dapat melakukan perubahan saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
