'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { calculateLineTotal, determineCurrency, getColumnMapping } from '@/lib/calculations';

interface Package {
  id: number;
  name: string;
}

interface PackagePrice {
  id: number;
  package_id: number;
  currency: string;
  adult_price: number;
  child_price: number;
}

interface ReportLine {
  id: number;
  package_price_id: number;
  adult_qty: number;
  child_qty: number;
  line_total: number;
  currency: string;
  package_name: string;
  adult_price: number;
  child_price: number;
}

interface DailyReport {
  id: number;
  report_date: string;
  usd_rate: number;
  eur_rate: number;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const isNew = reportId === 'new';

  const [report, setReport] = useState<DailyReport | null>(null);
  const [lines, setLines] = useState<ReportLine[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagePrices, setPackagePrices] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  // Form states
  const [reportDate, setReportDate] = useState('');
  const [usdRate, setUsdRate] = useState('1.0');
  const [eurRate, setEurRate] = useState('1.0');
  const [newLinePackagePriceId, setNewLinePackagePriceId] = useState('');
  const [newLineAdultQty, setNewLineAdultQty] = useState('1');
  const [newLineChildQty, setNewLineChildQty] = useState('0');

  useEffect(() => {
    if (!isNew) {
      fetchReport();
    } else {
      setReportDate(new Date().toISOString().split('T')[0]);
    }
    fetchPackages();
    fetchPackagePrices();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/daily-reports/${reportId}`);
      setReport(response.data);
      setReportDate(response.data.report_date);
      setUsdRate(response.data.usd_rate.toString());
      setEurRate(response.data.eur_rate.toString());

      const linesResponse = await axios.get(`/api/daily-reports/${reportId}/lines`);
      setLines(linesResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages');
      setPackages(response.data);
    } catch (err) {
      console.error('Failed to fetch packages', err);
    }
  };

  const fetchPackagePrices = async () => {
    try {
      const response = await axios.get('/api/package-prices');
      setPackagePrices(response.data);
    } catch (err) {
      console.error('Failed to fetch package prices', err);
    }
  };

  const handleSaveReport = async () => {
    try {
      if (isNew) {
        const response = await axios.post('/api/daily-reports', {
          reportDate,
          usdRate: parseFloat(usdRate),
          eurRate: parseFloat(eurRate),
        });
        router.push(`/reports/${response.data.id}`);
      } else {
        await axios.put(`/api/daily-reports/${reportId}`, {
          usdRate: parseFloat(usdRate),
          eurRate: parseFloat(eurRate),
        });
        alert('Rapor kaydedildi');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save report');
    }
  };

  const handleAddLine = async () => {
    if (!newLinePackagePriceId) {
      setError('Lütfen bir paket seçin');
      return;
    }

    try {
      const selectedPrice = packagePrices.find(p => p.id.toString() === newLinePackagePriceId);
      if (!selectedPrice) return;

      const adultQty = parseInt(newLineAdultQty);
      const childQty = parseInt(newLineChildQty);

      const lineTotal = calculateLineTotal(
        adultQty,
        childQty,
        selectedPrice.adult_price,
        selectedPrice.child_price
      );

      const currency = selectedPrice.currency;

      const response = await axios.post(`/api/daily-reports/${reportId}/lines`, {
        packagePriceId: selectedPrice.id,
        adultQty,
        childQty,
        lineTotal,
        currency,
      });

      // Refresh lines
      const linesResponse = await axios.get(`/api/daily-reports/${reportId}/lines`);
      setLines(linesResponse.data);

      // Reset form
      setNewLinePackagePriceId('');
      setNewLineAdultQty('1');
      setNewLineChildQty('0');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add line');
    }
  };

  const handleDeleteLine = async (lineId: number) => {
    if (confirm('Bu satırı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/daily-reports/${reportId}/lines/${lineId}`);
        setLines(lines.filter(l => l.id !== lineId));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete line');
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`/api/daily-reports/${reportId}/export-excel`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily_report_${reportDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to export Excel');
    }
  };

  // Calculate totals
  const totals = {
    creditCard: lines.filter(l => l.currency === 'KK').reduce((sum, l) => sum + l.line_total, 0),
    tl: lines.filter(l => l.currency === 'TL').reduce((sum, l) => sum + l.line_total, 0),
    usd: lines.filter(l => l.currency === 'USD').reduce((sum, l) => sum + l.line_total, 0),
    eur: lines.filter(l => l.currency === 'EUR').reduce((sum, l) => sum + l.line_total, 0),
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isNew ? 'Yeni Rapor' : `Rapor - ${reportDate}`}
          </h1>
          <Link href="/reports">
            <button className="text-gray-600 hover:text-gray-800">Geri Dön</button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Rapor Bilgileri</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tarih</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                disabled={!isNew}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">USD Kuru</label>
              <input
                type="number"
                step="0.01"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">EUR Kuru</label>
              <input
                type="number"
                step="0.01"
                value={eurRate}
                onChange={(e) => setEurRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSaveReport}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Raporu Kaydet
          </button>
        </div>

        {!isNew && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Satır Ekle</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Paket</label>
                  <select
                    value={newLinePackagePriceId}
                    onChange={(e) => setNewLinePackagePriceId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Paket Seç</option>
                    {packagePrices.map((price) => {
                      const pkg = packages.find(p => p.id === price.package_id);
                      return (
                        <option key={price.id} value={price.id}>
                          {pkg?.name} ({price.currency})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Adult Adet</label>
                  <input
                    type="number"
                    min="0"
                    value={newLineAdultQty}
                    onChange={(e) => setNewLineAdultQty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Child Adet</label>
                  <input
                    type="number"
                    min="0"
                    value={newLineChildQty}
                    onChange={(e) => setNewLineChildQty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddLine}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Satır Ekle
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Paket</th>
                    <th className="px-6 py-3 text-center font-semibold">Adult</th>
                    <th className="px-6 py-3 text-center font-semibold">Child</th>
                    <th className="px-6 py-3 text-right font-semibold">Toplam</th>
                    <th className="px-6 py-3 text-center font-semibold">Para Birimi</th>
                    <th className="px-6 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{line.package_name}</td>
                      <td className="px-6 py-4 text-center">{line.adult_qty}</td>
                      <td className="px-6 py-4 text-center">{line.child_qty}</td>
                      <td className="px-6 py-4 text-right">{line.line_total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">{line.currency}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteLine(line.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {lines.length === 0 && (
                <div className="p-8 text-center text-gray-600">
                  Henüz satır eklenmedi
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Günlük Toplamlar</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border-2 border-red-300 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">KREDİ KARTI</p>
                  <p className="text-2xl font-bold text-red-600">{totals.creditCard.toFixed(2)}</p>
                </div>
                <div className="border-2 border-green-300 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">TL</p>
                  <p className="text-2xl font-bold text-green-600">{totals.tl.toFixed(2)}</p>
                </div>
                <div className="border-2 border-blue-300 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">DOLAR</p>
                  <p className="text-2xl font-bold text-blue-600">{totals.usd.toFixed(2)}</p>
                </div>
                <div className="border-2 border-purple-300 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">EURO</p>
                  <p className="text-2xl font-bold text-purple-600">{totals.eur.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Excel İndir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
