# Daily Report System

Günlük rapor yönetimi, paket fiyatlandırması ve Excel export işlevselliği ile birlikte gelen tam yığın web uygulaması.

## Özellikler

✅ **Giriş & Kimlik Doğrulama** - Basit demo giriş sistemi  
✅ **Paket Yönetimi** - Paket oluştur, düzenle, sil  
✅ **Fiyat Yönetimi** - Para birimine göre fiyat taraması (TL, USD, EUR, KK)  
✅ **Günlük Rapor Oluşturma** - Paketleri seç, adult/child miktarı gir, otomatik hesaplama  
✅ **Para Birimi Dönüşümü** - Otomatik USD/EUR dönüşüm desteği  
✅ **Excel Export** - Raporları Excel'e aktar, hazır template  
✅ **Toplamlar Görünümü** - Para birimine göre günlük toplamlar  

## Teknoloji Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (SQLite geliştirmede kabul)
- **Excel:** ExcelJS
- **Authentication:** Demo (JWT-ready)

## Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- Docker & Docker Compose (opsiyonel)
- PostgreSQL (ya da Docker ile)

### Kurulum

1. **Repository'i klonla ve dependencies yükle:**
```bash
npm install
```

2. **Environment değişkenlerini ayarla (.env.local):**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/daily_reports
JWT_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Database'i ayarla:**

   **Seçenek A - Docker ile:**
   ```bash
   docker-compose up -d
   # Bu PostgreSQL başlatır ve schema.sql'i çalıştırır
   ```

   **Seçenek B - Manuel PostgreSQL:**
   ```bash
   # PostgreSQL çalışıyor olduğundan emin ol
   psql -U postgres -d daily_reports -f schema.sql
   ```

4. **Geliştirme sunucusunu başlat:**
```bash
npm run dev
```

Tarayıcıda açın: `http://localhost:3000`

**Demo Giriş:**
- Kullanıcı Adı: `admin`
- Şifre: `admin`

## Proje Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/route.ts           # Giriş endpoint'i
│   │   ├── packages/                     # Paket CRUD
│   │   ├── package-prices/               # Fiyat CRUD
│   │   └── daily-reports/
│   │       ├── route.ts                  # Rapor CRUD
│   │       ├── [id]/lines/               # Satır yönetimi
│   │       └── [id]/export-excel/        # Excel export
│   ├── dashboard/page.tsx                # Ana panel
│   ├── login/page.tsx                    # Giriş sayfası
│   ├── packages/page.tsx                 # Paket yönetimi
│   ├── prices/page.tsx                   # Fiyat yönetimi
│   └── reports/
│       ├── page.tsx                      # Rapor listesi
│       └── [id]/page.tsx                 # Rapor detayı & edit
├── lib/
│   ├── db.ts                             # Database bağlantısı
│   └── calculations.ts                   # Para birimi & hesaplama logigi
└── ...
```

## API Endpoints

### Authentication
```
POST /api/auth/login
  Body: { username, password }
  Response: { success, user, token }
```

### Packages (CRUD)
```
GET /api/packages
POST /api/packages
PUT /api/packages/[id]
DELETE /api/packages/[id]
```

### Package Prices (CRUD)
```
GET /api/package-prices
POST /api/package-prices
PUT /api/package-prices/[id]
DELETE /api/package-prices/[id]
```

### Daily Reports (CRUD)
```
GET /api/daily-reports
POST /api/daily-reports
PUT /api/daily-reports/[id]
DELETE /api/daily-reports/[id]
GET /api/daily-reports/[id]/lines
POST /api/daily-reports/[id]/lines
PUT /api/daily-reports/[id]/lines/[lineId]
DELETE /api/daily-reports/[id]/lines/[lineId]
POST /api/daily-reports/[id]/export-excel  (Excel dosyası döndürür)
```

## Database Schema

### Packages
- `id` (PK)
- `name` (VARCHAR, UNIQUE)
- `created_at`

### Package Prices
- `id` (PK)
- `package_id` (FK → packages)
- `currency` (VARCHAR: TL, USD, EUR, KK)
- `adult_price` (DECIMAL)
- `child_price` (DECIMAL)
- `valid_from` (DATE, nullable)
- `valid_to` (DATE, nullable)

### Daily Reports
- `id` (PK)
- `report_date` (DATE)
- `usd_rate` (DECIMAL) - Para dönüşüm için
- `eur_rate` (DECIMAL) - Para dönüşüm için
- `created_at`

### Report Lines
- `id` (PK)
- `report_id` (FK → daily_reports)
- `package_price_id` (FK → package_prices)
- `adult_qty` (INTEGER)
- `child_qty` (INTEGER)
- `line_total` (DECIMAL) - Hesaplanan toplam
- `currency` (VARCHAR: TL, USD, EUR, KK)

## Hesaplama Logigi

### Satır Toplamı Hesaplama
```
line_total = (adult_qty × adult_price) + (child_qty × child_price)
```

### Para Birimi Belirleme
1. **Öncelik 1:** Paket adından otomatik çıkarılan currency (örn. "Visitor Sinema Paketi USD" → USD)
2. **Öncelik 2:** Kullanıcı tarafından seçilen payment_type
3. **Fallback:** TL (varsayılan)

### Kolona Yazma Kuralı
- `currency = 'KK'` → KREDİ KARTI sütununa yaz
- `currency = 'TL'` → TL sütununa yaz
- `currency = 'USD'` → DOLAR sütununa yaz
- `currency = 'EUR'` → EURO sütununa yaz

## Excel Export

### Dosya Adı
`daily_report_[YYYY-MM-DD].xlsx`

### İçerik
- **Başlık:** Tarih ile rapor başlığı
- **Tablo:** Paket, Adult, Child, ve para birimi sütunları
- **Toplamlar:** Her para biriminin günlük toplamı
- **Format:** Professional tablo stili

Detaylı bilgi için [`EXCEL_MAPPING.md`](./EXCEL_MAPPING.md) dosyasını kontrol edin.

## Validasyon & Test

### Test Senaryosu 1: USD Paketi
```
1. Paket Seç: "Visitor Sinema Paketi USD"
2. Adult Qty: 2
3. Child Qty: 2
4. Otomatik fiyat çekme: Package Prices'tan USD fiyatları
5. Satır Toplamı: (2 × adult_price_usd) + (2 × child_price_usd)
6. Para Birimi: USD (otomatik algılama)
7. Excel Çıktı: DOLAR sütununa yazılır
```

### Test Senaryosu 2: TL + USD Mix
```
1. Rapor Oluştur
2. Satır 1: "Visitor Sinema Paketi TL" (adult=1, child=1)
3. Satır 2: "Visitor Sinema Paketi USD" (adult=2, child=0)
4. Excel'de toplamlar ayrı sütunlarda görülür
5. KREDİ KARTI = 0, TL = [satır1 toplam], USD = [satır2 toplam], EUR = 0
```

## Deployment

### Docker ile Deployment
```bash
docker-compose up -d
```

Bu komut:
- PostgreSQL database'i başlatır
- schema.sql'i çalıştırır
- Next.js uygulamasını başlatır
- Port 3000'de sunulur

### Production Build
```bash
npm run build
npm start
```

## Sorun Giderme

### Port 5432 zaten kullanımda
```bash
# Alternatif port belirt
docker-compose -f docker-compose.yml up -d
# Ya da mevcut PostgreSQL'yi durdur
```

### Database bağlantı hatası
```bash
# Bağlantıyı test et
psql -U postgres -h localhost -d daily_reports
```

### Excel export hatası
```bash
# ExcelJS yüklü olduğundan emin ol
npm list exceljs
npm install exceljs
```

## Geliştirme Notları

- Hesaplama logigi **backend'te** yapılır (frontend sadece gösterim)
- Para birimlerinin dönüştürülmesi konfigüre edilebilir
- Multi-user support hazır (JWT token ile)
- Responsive tasarım (mobile-friendly)

## Gelecek İyileştirmeler

- [ ] Kullanıcı rolü yönetimi (admin, user)
- [ ] Rapor şablonları (custom fields)
- [ ] Gelişmiş raporlama (tarih aralığı filtreleme)
- [ ] Dış API entegrasyonu (kur çekme)
- [ ] Veri validasyon ve hata yönetimi iyileştirmeleri
- [ ] Unit tests ve E2E tests

## Lisans

MIT

## İletişim

Sorularınız için lütfen issue açın.
