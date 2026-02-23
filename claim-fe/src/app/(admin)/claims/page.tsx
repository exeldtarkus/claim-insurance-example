/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ClaimsService from "@/services/claims"; // Pastikan service sudah mengarah ke /api/server/claims

export default function ClaimInquiryPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user?.data);

  // State untuk menyimpan data dari API
  const [claims, setClaims] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari Backend
  const fetchClaims = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await ClaimsService.getClaims({
        page: page,
        limit: 10,
      });

      // Mapping data sesuai struktur success_response (data.items & data.meta)
      setClaims(res.data?.items || []);
      setPagination(res.data?.meta || { page, limit: 10, total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Gagal mengambil data klaim:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch saat user sudah tersedia (login)
  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRowClick = (claimId: number) => {
    // Navigasi dinamis berdasarkan role (user/verifier/approver)
    const rolePath = user?.role?.toLowerCase() || "user";
    router.push(`/claims/${rolePath}/${claimId}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="animate-pulse text-gray-500 dark:text-gray-400">Memuat data pengguna...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle="Inquiry Klaim" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-7 xl:p-10">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500 animate-pulse">Menarik data dari server...</p>
            </div>
          ) : (
            <>
              <table className="w-full table-auto text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5 text-center">ID</th>
                    <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">Pemohon</th>
                    <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5">Nominal Klaim</th>
                    <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <tr
                        key={claim.id}
                        onClick={() => handleRowClick(claim.id)}
                        className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-5 xl:px-5 text-center">
                          <p className="font-bold text-gray-800 dark:text-white">#{claim.id}</p>
                          <p className="text-[10px] text-gray-400">v.{claim.version}</p>
                        </td>
                        <td className="px-4 py-5 xl:px-5">
                          <p className="font-medium text-gray-800 dark:text-white">{claim.user?.name || "No Name"}</p>
                          <p className="text-xs text-gray-500">{claim.user?.email}</p>
                        </td>
                        <td className="px-4 py-5 xl:px-5">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(claim.total_amount)}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">ID: {claim.insurance_id.split("-")[0]}...</p>
                        </td>
                        <td className="px-4 py-5 xl:px-5 text-center">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase
                            ${claim.status === "draft" ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : ""}
                            ${claim.status === "submitted" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500" : ""}
                            ${claim.status === "reviewed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500" : ""}
                            ${claim.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500" : ""}
                          `}>
                            {claim.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-400">
                        Belum ada riwayat klaim yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Simple Pagination Control */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
                <p className="text-sm text-gray-500">
                  Showing page <span className="font-medium text-gray-900 dark:text-white">{pagination.page}</span> of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => fetchClaims(pagination.page - 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchClaims(pagination.page + 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
