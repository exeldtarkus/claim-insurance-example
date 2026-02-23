/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ClaimsService from "@/services/claims";
import { Modal } from "@/components/ui/modal"; // Import Modal sesuai path baru

export default function VerifierClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const user = useSelector((state: RootState) => state.user?.data);

  // State Data
  const [claim, setClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Detail Klaim
  const fetchClaimDetail = async () => {
    try {
      setIsLoading(true);
      const res = await ClaimsService.getClaimById(id);
      setClaim(res.data);
    } catch (error) {
      console.error("Gagal memuat detail verifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) fetchClaimDetail();
  }, [user, id]);

  // 2. Fungsi Eksekusi Verifikasi (Dipanggil dari dalam Modal)
  const handleConfirmVerify = async () => {
    try {
      setIsProcessing(true);
      await ClaimsService.reviewClaim(id);

      setIsModalOpen(false); // Tutup modal setelah sukses
      // alert("Klaim berhasil di-review dan diteruskan ke Approver.");
      router.push("/claims");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Gagal melakukan verifikasi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (user?.role.toLowerCase() !== "verifier") {
    return <div className="p-10 text-center text-red-500 font-bold">AKSES DITOLAK: Role Verifier diperlukan.</div>;
  }

  if (isLoading) return <div className="flex h-[400px] items-center justify-center font-medium">Memuat data...</div>;
  if (!claim) return <div className="p-10 text-center text-gray-500">Klaim tidak ditemukan.</div>;

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle={`Verifikasi Klaim #${claim.id}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Panel Verifikator</h2>
            <p className="text-sm text-gray-500 italic">Status: <span className="font-bold text-yellow-600 uppercase">{claim.status}</span></p>
          </div>
          <button onClick={() => router.back()} className="text-sm font-medium text-blue-600 hover:underline">Kembali</button>
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-400">Informasi Pemohon</h3>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <p className="font-medium text-gray-800 dark:text-white">{claim.user?.name}</p>
              <p className="text-sm text-gray-500">{claim.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-gray-400">Rincian Klaim</h3>
            <div className="rounded-xl border border-blue-50 bg-blue-50/30 p-4 dark:bg-blue-900/10">
              <p className="text-xs text-gray-500 uppercase">Nominal</p>
              <p className="text-2xl font-bold text-blue-600">{formatRupiah(claim.total_amount)}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 border-t border-gray-100 pt-8 dark:border-gray-800">
          {claim.status === "submitted" ? (
            <button
              onClick={() => setIsModalOpen(true)} // Trigger Modal
              className="w-full rounded-lg bg-yellow-500 px-10 py-4 font-bold text-white shadow-lg hover:bg-yellow-600 transition"
            >
              TANDAI SEBAGAI REVIEWED
            </button>
          ) : (
            <div className="text-center text-gray-400 italic">Status {claim.status} - Tidak perlu verifikasi.</div>
          )}
        </div>
      </div>

      {/* IMPLEMENTASI MODAL BARU */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        className="max-w-[500px]"
        disableBackdropClick={isProcessing}
        disableEscClose={isProcessing}
      >
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
            Konfirmasi Verifikasi
          </h3>
          <p className="mb-8 text-gray-500">
            Apakah Anda sudah memeriksa validitas dokumen klaim ID <b>#{id}</b>? Status akan diubah menjadi <b>Reviewed</b> untuk disetujui Approver.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isProcessing}
              className="flex-1 rounded-2xl border border-gray-200 py-3.5 font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmVerify}
              disabled={isProcessing}
              className="flex-1 rounded-2xl bg-yellow-500 py-3.5 font-bold text-white shadow-lg hover:bg-yellow-600"
            >
              {isProcessing ? "Memproses..." : "Ya, Verifikasi"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
