/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ClaimsService from "@/services/claims";
import { Modal } from "@/components/ui/modal";

export default function ApproverClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const user = useSelector((state: RootState) => state.user?.data);

  // State Data & UI
  const [claim, setClaim] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk Modal Konfirmasi
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
  }>({
    isOpen: false,
    type: null,
  });

  // 1. Fetch Detail Klaim
  const fetchClaimDetail = async () => {
    try {
      setIsLoading(true);
      const res = await ClaimsService.getClaimById(id);
      setClaim(res.data);
    } catch (error) {
      console.error("Gagal memuat detail keputusan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) fetchClaimDetail();
  }, [user, id]);

  // 2. Fungsi Eksekusi Keputusan via Modal
  const handleConfirmAction = async () => {
    if (!modalConfig.type) return;

    try {
      setIsProcessing(true);
      if (modalConfig.type === "approve") {
        await ClaimsService.approveClaim(id);
      } else {
        await ClaimsService.rejectClaim(id);
      }

      setModalConfig({ isOpen: false, type: null });
      router.push("/claims");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Terjadi kesalahan saat memproses keputusan.");
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

  // Guard: Hanya role Approver
  if (user?.role.toLowerCase() !== "approver") {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        AKSES DITOLAK: Otoritas Approver diperlukan.
      </div>
    );
  }

  if (isLoading) return <div className="py-20 text-center animate-pulse">Menyiapkan data keputusan...</div>;
  if (!claim) return <div className="p-10 text-center">Data klaim tidak ditemukan.</div>;

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle={`Keputusan Klaim #${claim.id}`} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Keputusan Akhir</h2>
            <p className="text-sm text-gray-500">
              Status Terakhir: <span className="font-bold text-blue-600 uppercase">{claim.status}</span>
            </p>
          </div>
          <button onClick={() => router.back()} className="text-sm font-medium text-blue-600 hover:underline">
            Kembali
          </button>
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Nama Pemohon</label>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{claim.user?.name}</p>
              <p className="text-sm text-gray-500">{claim.user?.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">ID Referensi Asuransi</label>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-300">{claim.insurance_id}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/10">
              <label className="text-xs font-bold uppercase text-blue-400">Total Nominal Klaim</label>
              <p className="text-3xl font-black text-blue-600">{formatRupiah(claim.total_amount)}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Audit Info</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Versi Dokumen: v.{claim.version}</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-800 text-center">
          {claim.status === "reviewed" ? (
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setModalConfig({ isOpen: true, type: "approve" })}
                className="rounded-xl bg-green-600 px-10 py-4 font-bold text-white shadow-lg hover:bg-green-700 transition-all hover:scale-105"
              >
                APPROVE KLAIM
              </button>
              <button
                onClick={() => setModalConfig({ isOpen: true, type: "reject" })}
                className="rounded-xl border-2 border-red-600 px-10 py-4 font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                REJECT KLAIM
              </button>
            </div>
          ) : (
            <p className="italic text-gray-400 text-sm">Aksi tidak tersedia untuk status {claim.status}</p>
          )}
        </div>
      </div>

      {/* MODAL INTEGRASI */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => !isProcessing && setModalConfig({ isOpen: false, type: null })}
        className="max-w-[480px]"
        disableBackdropClick={isProcessing}
        disableEscClose={isProcessing}
      >
        <div className="p-8 text-center">
          {/* Icon Dinamis */}
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            modalConfig.type === "approve" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {modalConfig.type === "approve" ? (
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h3 className="mb-3 text-2xl font-black text-gray-800 dark:text-white uppercase">
            {modalConfig.type === "approve" ? "Konfirmasi Approve" : "Konfirmasi Reject"}
          </h3>
          <p className="mb-8 text-gray-500 leading-relaxed">
            Apakah Anda yakin ingin memberikan keputusan <b>{modalConfig.type?.toUpperCase()}</b> untuk klaim ini?
            Tindakan ini akan dicatat sebagai keputusan final Anda.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setModalConfig({ isOpen: false, type: null })}
              disabled={isProcessing}
              className="flex-1 rounded-2xl border border-gray-200 py-4 font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`flex-1 rounded-2xl py-4 font-bold text-white shadow-xl transition-all ${
                modalConfig.type === "approve" ? "bg-green-600 hover:bg-green-700 shadow-green-200/50" : "bg-red-600 hover:bg-red-700 shadow-red-200/50"
              }`}
            >
              {isProcessing ? "Memproses..." : "Ya, Eksekusi"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
