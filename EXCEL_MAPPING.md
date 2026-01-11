# Excel Template Mapping Dokümantasyonu

## Genel Bilgi

Sistem, günlük raporları otomatik olarak Excel dosyalarına dönüştürür. Excel yapısı aşağıda detaylı şekilde açıklanmıştır.

## Excel Dosya Yapısı

### Başlık (Title Row)
- **Satır 1:** Merged cells A1:G1
- **İçerik:** "Günlük Rapor - [TARIH]"
- **Format:** Bold, 14pt font, Center aligned

### Boş Satır
- **Satır 2:** Boş satır (visual spacing)

### Sütun Başlıkları
- **Satır 3 (Header Row):**
  - **A:** Paket
  - **B:** Adult Adet
  - **C:** Child Adet
  - **D:** KREDİ KARTI
  - **E:** TL
  - **F:** DOLAR
  - **G:** EURO
  - **Format:** Light gray background, Bold text

## Veri Satırları

### Satır Yapısı (Satır 4'ten başlayarak)
Her satır, bir rapor satırını (report_line) temsil eder:

| Sütun | Alan | Kaynağı |
|-------|------|---------|
| A | Paket Adı | `packages.name` |
| B | Adult Miktarı | `report_lines.adult_qty` |
| C | Child Miktarı | `report_lines.child_qty` |
| D | KREDİ KARTI Toplam | `report_lines.line_total` (eğer `currency='KK'`) |
| E | TL Toplam | `report_lines.line_total` (eğer `currency='TL'`) |
| F | USD Toplam | `report_lines.line_total` (eğer `currency='USD'`) |
| G | EUR Toplam | `report_lines.line_total` (eğer `currency='EUR'`) |

### Para Birimi Logic
- Eğer `report_lines.currency = 'KK'` => Değer **D** sütununa yazılır, diğerleri boş
- Eğer `report_lines.currency = 'TL'` => Değer **E** sütununa yazılır, diğerleri boş
- Eğer `report_lines.currency = 'USD'` => Değer **F** sütununa yazılır, diğerleri boş
- Eğer `report_lines.currency = 'EUR'` => Değer **G** sütununa yazılır, diğerleri boş

## Toplam Satırı

### Konumu
- **Satır:** Son veri satırından hemen sonra (örneğin, 5 veri satırı varsa satır 9)

### Yapısı
| Sütun | İçerik |
|-------|--------|
| A | "TOPLAM" (Bold) |
| B | Boş |
| C | Boş |
| D | KREDİ KARTI toplamı (sum of all KK lines) |
| E | TL toplamı (sum of all TL lines) |
| F | USD toplamı (sum of all USD lines) |
| G | EUR toplamı (sum of all EUR lines) |

- **Format:** Bold font

## Örnek Excel Çıktısı

```
Günlük Rapor - 2025-01-11
[Boş Satır]
Paket                  | Adult | Child | KREDİ KARTI | TL    | DOLAR | EURO
Visitor Sinema USD     | 2     | 2     |             |       | 100   |
Combo Paketi TL        | 1     | 1     |             | 200   |       |
Visitor Sinema EUR     | 3     | 0     |             |       |       | 150
TOPLAM                 |       |       |             | 200   | 100   | 150
```

## Sütun Genişlikleri

| Sütun | Genişlik (karakterler) |
|-------|------------------------|
| A | 25 |
| B | 12 |
| C | 12 |
| D | 15 |
| E | 15 |
| F | 15 |
| G | 15 |

## Sayı Formatı

- **Para Birimi Sütunları (D, E, F, G):** 2 ondalak basamak (örneğin: 100.00)
- **Miktar Sütunları (B, C):** Tam sayı (örneğin: 2)

## İmplementasyon Detayları

### Backend (Node.js + ExcelJS)
Daha fazla bilgi için `src/app/api/daily-reports/[id]/export-excel/route.ts` dosyasını kontrol edin.

### Frontend
- Kullanıcı "Excel İndir" butonuna basarsa
- POST `/api/daily-reports/[id]/export-excel` çağrılır
- Dosya `daily_report_[DATE].xlsx` olarak indirilir

## Özelleştirme ve Notlar

- Excel dosyası dinamik olarak oluşturulur (mevcut Excel template'i kullanmaz)
- Format her zaman korunur
- Yeni rapor oluşturulursa yeni Excel dosyası generate edilir

## Validasyon Kuralları

1. Her satır için en az bir `report_line` olmalıdır
2. Tüm `line_total` değerleri 2 ondalak basamaklı olmalıdır
3. Para birimi (currency) değeri sadece KK, TL, USD, EUR olabilir

## Sorun Giderme

Eğer Excel dosyası oluşturulamıyorsa:
1. ExcelJS paketi yüklü olduğundan emin olun: `npm list exceljs`
2. Node.js version 14+ olduğundan emin olun
3. Database bağlantısını kontrol edin
