'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { packageStorage, Package, initializeMockData } from '@/lib/storage';

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPackageName, setNewPackageName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Initialize mock data on first load
    initializeMockData();
    setPackages(packageStorage.getAll());
    setLoading(false);
  }, [router]);

  const handleAddPackage = () => {
    if (!newPackageName.trim()) {
      alert('Paket adı boş olamaz');
      return;
    }

    packageStorage.add(newPackageName);
    setPackages(packageStorage.getAll());
    setNewPackageName('');
  };

  const handleDeletePackage = (id: string) => {
    if (!confirm('Bu paketi silmek istediğinizden emin misiniz?')) return;
    packageStorage.delete(id);
    setPackages(packageStorage.getAll());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
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
          <h1 className="text-3xl font-bold text-white">📦 Paketler</h1>
          <div className="text-sm text-gray-400">
            Toplam: <span className="font-semibold text-white">{packages.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Add Package Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Yeni Paket Ekle</h2>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPackage()}
              placeholder="Paket adı (ör: Visitor Sinema Paketi USD)"
              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              + Ekle
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4m0-4h4m-4 0H9" />
            </svg>
            <p className="text-gray-400 text-lg">Henüz paket yok. Yukarıdan yeni paket ekle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:border-purple-500 rounded-xl p-6 transition group"
              >
                {editingId === pkg.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 break-words group-hover:text-purple-300 transition">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Ekleme: {new Date(pkg.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg border border-red-400/50 transition text-sm font-medium"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 rounded-xl p-8">
          <h3 className="text-white font-bold text-lg mb-4">💡 İpuçları</h3>
          <ul className="text-gray-300 space-y-2">
            <li>✓ Para birimini paket adına ekleyin (USD, TL, EUR, KK)</li>
            <li>✓ Örnek: "Visitor Sinema Paketi USD" veya "Combo Paketi TL"</li>
            <li>✓ Paket adında bulunacak para birimleri otomatik algılanır</li>
            <li>✓ Paket oluşturduktan sonra <Link href="/prices" className="text-blue-300 hover:text-blue-200 font-semibold">Fiyatlar</Link> sayfasında fiyat ekleyin</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
