'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats {
  packages: number;
  prices: number;
  reports: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({ packages: 0, prices: 0, reports: 0 });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userStr));

    // Load stats from localStorage
    const packages = JSON.parse(localStorage.getItem('packages') || '[]');
    const prices = JSON.parse(localStorage.getItem('packagePrices') || '[]');
    const reports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
    
    setStats({
      packages: packages.length,
      prices: prices.length,
      reports: reports.length
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Rapor Sistemi</h1>
              <p className="text-gray-400 text-sm">Hoşgeldin, {user.username}! 👋</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-2 rounded-lg border border-red-400/50 transition"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Paketler</p>
                <p className="text-4xl font-bold mt-2">{stats.packages}</p>
              </div>
              <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Fiyatlar</p>
                <p className="text-4xl font-bold mt-2">{stats.prices}</p>
              </div>
              <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Raporlar</p>
                <p className="text-4xl font-bold mt-2">{stats.reports}</p>
              </div>
              <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 110 8h2a1 1 0 100-2H4V5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reports Card */}
          <Link href="/reports">
            <div className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-blue-500 rounded-xl p-8 cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Günlük Raporlar</h3>
              <p className="text-gray-400 text-sm mb-4">Raporları yönet ve oluştur</p>
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                {stats.reports} rapor
              </div>
            </div>
          </Link>

          {/* Packages Card */}
          <Link href="/packages">
            <div className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500 rounded-xl p-8 cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Paketler</h3>
              <p className="text-gray-400 text-sm mb-4">Paketleri ekle ve yönet</p>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                {stats.packages} paket
              </div>
            </div>
          </Link>

          {/* Prices Card */}
          <Link href="/prices">
            <div className="group bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-orange-500 rounded-xl p-8 cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-4 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm1.5 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Paket Fiyatları</h3>
              <p className="text-gray-400 text-sm mb-4">Fiyatları düzenle</p>
              <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-200 text-xs rounded-full">
                {stats.prices} fiyat
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8">
          <h3 className="text-white font-bold text-lg mb-4">🎯 Hızlı Başlangıç</h3>
          <ol className="text-gray-300 space-y-2">
            <li>1️⃣ <span className="text-blue-200 font-semibold">Paketler</span> sekmesinde paket ekle (ör: "Visitor USD")</li>
            <li>2️⃣ <span className="text-orange-200 font-semibold">Fiyatlar</span> sekmesinde fiyat ekle (Adult/Child)</li>
            <li>3️⃣ <span className="text-blue-200 font-semibold">Raporlar</span> sekmesinde rapor oluştur</li>
            <li>4️⃣ Satırları ekle ve Excel'e aktar</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
