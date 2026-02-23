import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Claim Approval System",
  description: "Dashboard untuk memantau status klaim asuransi",
};

// --- DUMMY DATA ---
const summaryMetrics = [
  { id: 1, title: "Total Klaim (Bulan Ini)", value: "124", icon: "📊", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: 2, title: "Menunggu Verifikasi", value: "12", icon: "⏳", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { id: 3, title: "Menunggu Approval", value: "5", icon: "👀", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { id: 4, title: "Klaim Disetujui", value: "98", icon: "✅", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
];

const recentClaims = [
  { id: "CLM-202602-001", applicant: "Exel Tarkus", type: "Rawat Inap", date: "23 Feb 2026", amount: "Rp 15.000.000", status: "submitted" },
  { id: "CLM-202602-002", applicant: "Budi Santoso", type: "Kecelakaan Kerja", date: "22 Feb 2026", amount: "Rp 8.500.000", status: "reviewed" },
  { id: "CLM-202602-003", applicant: "Andi Wijaya", type: "Kacamata", date: "20 Feb 2026", amount: "Rp 1.200.000", status: "approved" },
  { id: "CLM-202602-004", applicant: "Siti Aminah", type: "Melahirkan", date: "18 Feb 2026", amount: "Rp 12.000.000", status: "rejected" },
  { id: "CLM-202602-005", applicant: "Reza Rahadian", type: "Rawat Jalan", date: "15 Feb 2026", amount: "Rp 750.000", status: "approved" },
];

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 space-y-6">

      {/* Header Dashboard */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Klaim</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ringkasan aktivitas klaim asuransi Anda.</p>
        </div>
      </div>

      {/* Grid Metrik Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark flex items-center gap-4"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${metric.bg} ${metric.color} text-2xl`}>
              {metric.icon}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{metric.value}</h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel Klaim Terbaru */}
      <div className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-default dark:border-gray-800 dark:bg-gray-dark sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Aktivitas Klaim Terbaru</h3>
          <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Lihat Semua</button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left dark:bg-gray-800/50">
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">ID Klaim</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Pemohon</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Tipe Klaim</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Tanggal</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Nilai Klaim</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.map((claim, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-white">{claim.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{claim.applicant}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{claim.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{claim.date}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-300">{claim.amount}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize
                        ${claim.status === "draft" ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : ""}
                        ${claim.status === "submitted" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500" : ""}
                        ${claim.status === "reviewed" ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-500" : ""}
                        ${claim.status === "approved" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500" : ""}
                        ${claim.status === "rejected" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500" : ""}
                      `}
                    >
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
