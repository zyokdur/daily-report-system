# Kurulum ve Hızlı Başlangıç Kılavuzu

## Sistem Gereksinimleri

- **Node.js:** 18.17 veya üzeri
- **npm:** 9.0 veya üzeri
- **PostgreSQL:** 12 veya üzeri (veya Docker)
- **Git:** (opsiyonel, kod indirmek için)

## Adım 1: Projeyi İndir ve Dependencies Yükle

### GitHub'dan Klonla (varsa)
```bash
git clone https://github.com/yourusername/daily-report-system.git
cd daily-report-system
```

### veya Dosyaları Indirdiysen
```bash
cd daily-report-system
npm install
```

## Adım 2: Environment Dosyası Oluştur

`.env.local` dosyası proje kökünde zaten var. Gerekirse edit et:

```bash
# .env.local

# PostgreSQL Bağlantısı
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/daily_reports

# JWT Secret (production'da değiştir)
JWT_SECRET=your-secret-key-change-this-in-production

# Development ortamı
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Adım 3: Database Ayarı

### Seçenek A: Docker ile (Önerilen)

```bash
# PostgreSQL'i Docker'da başlat
docker-compose up -d postgres

# 5 saniye bekle ve schema'yı çalıştır
docker exec daily-report-postgres psql -U postgres -d daily_reports -f schema.sql
```

### Seçenek B: Manuel PostgreSQL

PostgreSQL'in yüklü olduğundan emin ol, ardından:

```bash
# Linux/Mac
psql -U postgres -c "CREATE DATABASE daily_reports;"
psql -U postgres -d daily_reports -f schema.sql

# Windows (PowerShell)
psql -U postgres -c "CREATE DATABASE daily_reports;"
psql -U postgres -d daily_reports -f schema.sql
```

## Adım 4: Uygulamayı Çalıştır

### Geliştirme Modu (Recommended)
```bash
npm run dev
```

Çıktı:
```
   ▲ Next.js 15.5.9
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000
```

Tarayıcıda açın: **http://localhost:3000**

### Production Mode
```bash
npm run build
npm start
```

## Adım 5: Giriş Yap

Açılan sayfada:
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin`

## Adım 6: İlk Rapor Oluştur

1. Dashboard'dan **"Paketler"** sekmesine git
2. Paket ekle: "Visitor Sinema Paketi USD"
3. **"Paket Fiyatları"** sekmesine git
4. Para birimi: USD, Adult Fiyat: 50, Child Fiyat: 25
5. **"Günlük Raporlar"** sekmesine git
6. "Yeni Rapor Oluştur" ile rapor başlat
7. Paket seç, adult/child miktarı gir
8. "Excel İndir" ile raporu dışa aktar

## Sorun Giderme

### "Cannot find module 'pg'"
```bash
npm install
```

### "Database connection failed"
PostgreSQL çalışıyor mu kontrol et:
```bash
# Linux/Mac
sudo systemctl status postgresql

# Windows (Docker)
docker ps | grep postgres
```

### Port 3000 zaten kullanımda
```bash
npm run dev -- -p 3001
```

### CORS hatası
`.env.local` dosyasında NEXT_PUBLIC_API_URL'nin doğru olduğundan emin ol.

### Build hatası
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

## Docker ile Full Stack Deployment

```bash
# Tüm servisleri başlat
docker-compose up -d

# Log'ları kontrol et
docker-compose logs -f app

# Durdur
docker-compose down
```

## Dosya Yapısı Özeti

```
daily-report-system/
├── src/
│   ├── app/api/           # Backend API endpoints
│   ├── app/*/page.tsx     # Frontend sayfaları
│   ├── lib/              # Utilities (db, calculations)
├── public/               # Statik dosyalar
├── schema.sql            # Database şeması
├── package.json          # Dependencies
├── docker-compose.yml    # Docker setup
├── .env.local           # Environment variables
└── README.md            # Dokumentasyon
```

## Sonraki Adımlar

1. Admin kullanıcı ekle (db'ye SQL ile ekle)
2. Paketler ve fiyatlar ekle
3. Rapor oluştur ve test et
4. Excel export'u test et

## Support

Sorularınız varsa README.md ve EXCEL_MAPPING.md dosyalarını kontrol edin.

---

**Mutlu Raporlamalar! 📊**
