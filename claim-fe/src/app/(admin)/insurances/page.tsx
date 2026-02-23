"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { Modal } from "@/components/ui/modal";
import InsuranceService, { IInsurance } from "@/services/insurance";

export default function InsurancePage() {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user?.data);
  const isNormalUser = user?.role?.toLowerCase() === "user";

  // State untuk Data API
  const [insurances, setInsurances] = useState<IInsurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | null>(null);

  // Fetch Data dari API
  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setIsLoading(true);
        const data = await InsuranceService.getAllInsurances();
        setInsurances(data);
      } catch (error) {
        console.error("Gagal mengambil data asuransi:", error);
        setInsurances([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleClaimClick = (insuranceUuid: string) => {
    setSelectedInsuranceId(insuranceUuid);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInsuranceId(null);
  };

  const handleConfirmClaim = () => {
    const targetInsuranceId = selectedInsuranceId;
    setIsModalOpen(false);
    setSelectedInsuranceId(null);

    if (targetInsuranceId) {
      router.push(`/claims/draft?insurance_id=${targetInsuranceId}`);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle="Daftar Asuransi (Insurances)" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-7 xl:p-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Data Polis Asuransi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Seluruh data asuransi aktif dalam sistem.</p>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-gray-500">Memuat data API...</div>
          ) : (
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">UUID Ref</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">Tipe Asuransi</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">User ID</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">Deskripsi</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5 text-right">Nilai (Amount)</th>
                  {isNormalUser && (
                    <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5 text-center">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {insurances.map((insurance) => (
                  <tr key={insurance.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-5 xl:px-5">
                      <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        #{insurance.uuid.split("-")[0]}
                      </p>
                    </td>
                    <td className="px-4 py-5 xl:px-5">
                      <span className="capitalize text-gray-700 dark:text-gray-300 font-medium">
                        {insurance.insurance_type}
                      </span>
                    </td>
                    <td className="px-4 py-5 xl:px-5">
                      <p className="text-gray-500 dark:text-gray-400">USR-{insurance.user_id || "-"}</p>
                    </td>
                    <td className="px-4 py-5 xl:px-5 max-w-[200px] truncate">
                      <p className="text-gray-500 dark:text-gray-400" title={insurance.desc}>
                        {insurance.desc || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-5 xl:px-5 text-right">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatRupiah(insurance.amount)}
                      </p>
                    </td>
                    {isNormalUser && (
                      <td className="px-4 py-5 xl:px-5 text-center">
                        <button
                          onClick={() => handleClaimClick(insurance.uuid)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                          CLAIM
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {insurances.length === 0 && (
                  <tr>
                    <td colSpan={isNormalUser ? 6 : 5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                      Belum ada data asuransi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-md p-6 sm:p-8">
        <div className="text-center sm:text-left">
          <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Konfirmasi Pengajuan Klaim</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Apakah anda akan claim insurance ID <span className="font-semibold text-blue-600 dark:text-blue-400">#{selectedInsuranceId?.split("-")[0]}</span>?
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button onClick={handleCloseModal} className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              CANCEL
            </button>
            <button onClick={handleConfirmClaim} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700">
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
