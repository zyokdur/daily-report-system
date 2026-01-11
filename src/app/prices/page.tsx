'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { packageStorage, priceStorage, initializeMockData } from '@/lib/storage';
import type { Package, PackagePrice } from '@/lib/storage';

export default function PricesPage() {
  const router = useRouter();
  const [prices, setPrices] = useState<PackagePrice[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPrice, setNewPrice] = useState({
    packageId: '',
    currency: 'TL',
    adultPrice: '',
    childPrice: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Initialize mock data on first load
    initializeMockData();
    setPackages(packageStorage.getAll());
    setPrices(priceStorage.getAll());
    setLoading(false);
  }, [router]);

  const handleAddPrice = () => {
    if (!newPrice.packageId || !newPrice.adultPrice || !newPrice.childPrice) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    priceStorage.add(
      newPrice.packageId,
      newPrice.currency,
      parseFloat(newPrice.adultPrice),
      parseFloat(newPrice.childPrice)
    );

    setPrices(priceStorage.getAll());
    setNewPrice({
      packageId: '',
      currency: 'TL',
      adultPrice: '',
      childPrice: '',
    });
  };

  const handleDeletePrice = (id: string) => {
    if (!confirm('Bu fiyatı silmek istediğinizden emin misiniz?')) return;
    priceStorage.delete(id);
    setPrices(priceStorage.getAll());
  };

  const getPackageName = (packageId: string) => {
    return packages.find(p => p.id === packageId)?.name || 'Bilinmiyor';
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
          <h1 className="text-3xl font-bold text-white">💰 Fiyatlar</h1>
          <div className="text-sm text-gray-400">
            Toplam: <span className="font-semibold text-white">{prices.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Add Price Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Yeni Fiyat Ekle</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Paket</label>
              <select
                value={newPrice.packageId}
                onChange={(e) => setNewPrice({ ...newPrice, packageId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Paket Seç</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Para Birimi</label>
              <select
                value={newPrice.currency}
                onChange={(e) => setNewPrice({ ...newPrice, currency: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="TL">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="KK">KREDİ KARTI</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Adult Fiyat</label>
              <input
                type="number"
                step="0.01"
                value={newPrice.adultPrice}
                onChange={(e) => setNewPrice({ ...newPrice, adultPrice: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Child Fiyat</label>
              <input
                type="number"
                step="0.01"
                value={newPrice.childPrice}
                onChange={(e) => setNewPrice({ ...newPrice, childPrice: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddPrice}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95"
              >
                + Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Prices Table */}
        {prices.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-lg">Henüz fiyat yok. Yukarıdan yeni fiyat ekle.</p>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Paket</th>
                    <th className="px-6 py-4 text-center text-gray-300 font-semibold">Para Birimi</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Adult</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Child</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => (
                    <tr key={price.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition">
                      <td className="px-6 py-4 text-white">{getPackageName(price.packageId)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/50">
                          {price.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">{price.adultPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-gray-300">{price.childPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeletePrice(price.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg border border-red-400/50 transition text-sm font-medium"
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-400/30 rounded-xl p-8">
          <h3 className="text-white font-bold text-lg mb-4">💡 İpuçları</h3>
          <ul className="text-gray-300 space-y-2">
            <li>✓ Her paket için farklı para birimlerinde fiyat belirleyin</li>
            <li>✓ Adult ve Child fiyatları ayrı olarak girin</li>
            <li>✓ Aynı paket ve para birimi için sadece bir fiyat aktif olabilir</li>
            <li>✓ Raporlarda satır oluştururken bu fiyatlar otomatik yüklenir</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
