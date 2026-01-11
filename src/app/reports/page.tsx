'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reportStorage, initializeMockData } from '@/lib/storage';
import type { DailyReport } from '@/lib/storage';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Initialize mock data on first load
    initializeMockData();
    setReports(reportStorage.getAll());
    setLoading(false);
  }, [router]);

  const handleDelete = (id: string) => {
    if (!confirm('Bu raporu silmek istediğinizden emin misiniz?')) return;
    reportStorage.delete(id);
    setReports(reportStorage.getAll());
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Panele Dön
          </Link>
          <h1 className="text-3xl font-bold text-white">📊 Günlük Raporlar</h1>
          <Link href="/reports/new">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105">
              + Yeni Rapor
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {reports.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">Henüz rapor yok. Yeni rapor oluşturmaya başla.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-blue-500 rounded-xl p-6 transition group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
                      📅 {new Date(report.date).toLocaleDateString('tr-TR')}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {report.lines.length} satır
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg border border-red-400/50 transition text-sm"
                  >
                    🗑️
                  </button>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(report.totals).map(([currency, total]) => (
                      <div key={currency} className="flex justify-between">
                        <span className="text-gray-300">{currency}:</span>
                        <span className="text-white font-semibold">{total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={`/reports/${report.id}`}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium">
                    Düzenle & Excel
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Günlük Raporlar</h1>
          <Link href="/reports/new">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Yeni Rapor Oluştur
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">Henüz rapor yok.</p>
            <Link href="/reports/new">
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                İlk Raporunu Oluştur
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Tarih</th>
                  <th className="px-6 py-3 text-left font-semibold">USD Kuru</th>
                  <th className="px-6 py-3 text-left font-semibold">EUR Kuru</th>
                  <th className="px-6 py-3 text-left font-semibold">Oluşturma Tarihi</th>
                  <th className="px-6 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{report.report_date}</td>
                    <td className="px-6 py-4">{report.usd_rate}</td>
                    <td className="px-6 py-4">{report.eur_rate}</td>
                    <td className="px-6 py-4">{new Date(report.created_at).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/reports/${report.id}`}>
                        <button className="text-blue-600 hover:text-blue-800 mr-4">
                          Düzenle
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
