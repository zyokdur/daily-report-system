# ⚡ Hızlı Başlangıç

## 1️⃣ Bağımlılıkları Yükle
```bash
npm install
```

## 2️⃣ Database'i Başlat
```bash
# Docker ile
docker-compose up -d postgres

# 5 saniye bekle
sleep 5

# Schema'yı çalıştır
docker exec daily-report-postgres psql -U postgres -d daily_reports -f schema.sql
```

## 3️⃣ Uygulamayı Çalıştır
```bash
npm run dev
```

## 4️⃣ Tarayıcıda Aç
```
http://localhost:3000
```

## 5️⃣ Giriş Yap
```
Kullanıcı: admin
Şifre: admin
```

## 6️⃣ İlk Rapor Oluştur

### A. Paket Ekle
1. Dashboard → Paketler
2. Paket adı: "Visitor Sinema Paketi USD"
3. Ekle

### B. Fiyat Ekle
1. Dashboard → Paket Fiyatları
2. Paket seç: "Visitor Sinema Paketi USD"
3. Para Birimi: USD
4. Adult Fiyat: 50
5. Child Fiyat: 25
6. Ekle

### C. Rapor Oluştur
1. Dashboard → Günlük Raporlar
2. "Yeni Rapor Oluştur"
3. Tarih: Bugün
4. Kuru: USD=1.0, EUR=1.0 (sonra değiştirebilirsin)
5. "Raporu Kaydet"

### D. Satır Ekle
1. Paket seç: "Visitor Sinema Paketi USD"
2. Adult Adet: 2
3. Child Adet: 1
4. "Satır Ekle"

### E. Sonuçları Gör
1. Günlük Toplamlar bölümünde DOLAR = 125.00 göreceksin
2. Excel İndir butonuna bas
3. Excel dosyası indirilecek

---

## 🐛 Sorunlar?

### Port 3000 zaten kullanımda?
```bash
npm run dev -- -p 3001
```

### Database bağlantısı başarısız?
```bash
# PostgreSQL çalışıyor mu kontrol et
docker ps

# Yeniden başlat
docker-compose restart postgres
```

### Build hatası?
```bash
npm cache clean --force
npm install
npm run build
```

---

## 📚 Daha Fazla Bilgi

- 📖 [README.md](./README.md) - Detaylı dokumentasyon
- 🔧 [INSTALLATION.md](./INSTALLATION.md) - Kurulum rehberi
- 📊 [EXCEL_MAPPING.md](./EXCEL_MAPPING.md) - Excel yapısı
- 📁 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Proje yapısı

---

**Hazırsan? npm run dev'i çalıştır! 🚀**
