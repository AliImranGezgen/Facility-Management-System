# 🏢 Akıllı Tesis Yönetim Sistemi v2.0 (Smart Facility Management System)

> **React, Python ve Dijital İkiz (Digital Twin) teknolojileriyle güçlendirilmiş, veri odaklı yeni nesil bina işletim sistemi.**

![Project Banner]([https://via.placeholder.com/1200x400/1e293b/3b82f6?text=Akilli+Tesis+Yonetim+Sistemi+v2.0](https://lh3.googleusercontent.com/notebooklm/AG60hOqwengooL4iMS4jy3HnM5A_dmkwZFMDYtuRIsiFL-Jhx6UbzyDA6trzxppRgkqqMeykq5C_6QCmqNr1-z_76By0J5sco4lUfWF834CTXCPWJ_bdRyo65Xj3qoGNP22qFt2lSRPJZ1eyb7mKteeFbglUy8NWN4c=w2752-d-h1536-mp2?authuser=0))

## 📖 Proje Hakkında

Bu proje, AVM, hastane veya havalimanı gibi büyük ölçekli tesislerin yönetimini geleneksel yöntemlerden çıkarıp **veri odaklı** ve **öngörülebilir** hale getirmeyi amaçlayan tam kapsamlı bir Dashboard çözümüdür.

Sistem, tesisin fiziksel yapısının dijital bir kopyasını (**Digital Twin**) oluşturarak yöneticilere anlık izleme, yapay zeka destekli simülasyon ve önleyici bakım imkanları sunar.

### 🌟 Öne Çıkan Özellikler

* **360° Canlı İzleme:** Enerji, HVAC, Güvenlik, Temizlik ve Ticari verilerin (Kira/Doluluk) tek ekranda takibi.
* **🤖 Dijital İkiz & Simülasyon:** "Ziyaretçi sayısı 2 katına çıkarsa sıcaklık ne olur?" gibi senaryoları simüle eden Python tabanlı yapay zeka motoru.
* **🩺 Varlık Sağlığı (Asset Health):** Cihazların (Asansör, Jeneratör) sağlık durumlarını puanlayan (%92, %15) ve arıza çıkmadan uyaran **Önleyici Bakım (Preventive Maintenance)** modülü.
* **🚨 Gelişmiş Alarm Yönetimi:** Yangın, güvenlik ihlali veya kapasite aşımı gibi durumlarda anlık reaksiyon sistemi.
* **📊 Ticari Entegrasyon:** Mağaza doluluk oranları, kira tahsilat durumu ve ziyaretçi analitiği (Footfall).
* **UI/UX:** Modern, "Dark Mode" odaklı, kullanıcı dostu ve responsive tasarım.

---

## 🏗️ Mimari ve Teknolojiler

Bu proje, modern ve ölçeklenebilir bir teknoloji yığını üzerine inşa edilmiştir.

### Frontend (Arayüz)
* **React (Vite):** Hızlı ve modüler bileşen yapısı.
* **TypeScript:** Tip güvenli kod geliştirme.
* **Tailwind CSS:** Modern ve esnek stil yönetimi.
* **Recharts:** Gelişmiş veri görselleştirme ve grafikler.
* **Lucide React:** Modern ikon setleri.
* **State Management:** Context API.

### Backend (Motor)
* **Python:** Veri işleme ve simülasyon algoritmaları.
* **FastAPI / Uvicorn:** Yüksek performanslı asenkron REST API sunucusu.
* **Pandas & NumPy:** Veri analitiği ve hesaplamalar.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler
* Node.js (v16+)
* Python (v3.9+)

### 1. Projeyi Klonlayın
```bash
git clone [https://github.com/kullaniciadiniz/tesis-yonetim-sistemi.git](https://github.com/kullaniciadiniz/tesis-yonetim-sistemi.git)
cd tesis-yonetim-sistemi
```

### 2. Backend Kurulumu (Python)
```CMD
cd backend
# Sanal ortam oluşturma (Opsiyonel ama önerilir)
python -m venv venv

# Windows için:
venv\Scripts\activate
# Mac/Linux için:
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Sunucuyu başlat
uvicorn app.main:app --reload

Backend http://127.0.0.1:8000 adresinde çalışacaktır.
```

### 3. Frontend Kurulumu (React)
Yeni bir terminal açın ve proje ana dizinine dönün:
```
cd frontend
# Paketleri yükle
npm install

# Uygulamayı başlat
npm run dev
```

### 🔮 Gelecek Planları (Roadmap)
* **[x]** Temel Dashboard ve Canlı İzleme
* **[x]** Dijital İkiz Simülasyon Motoru
* **[x]** Varlık Sağlığı ve Önleyici Bakım Modülü
* **[ ]** YOLO Entegrasyonu: Kameralardan gerçek zamanlı insan sayma ve güvenlik ihlali tespiti.
* **[ ]** Mobil Uygulama: Saha personeli için React Native uygulaması.
* **[ ]** IoT Gateway: MQTT üzerinden gerçek sensör verilerinin entegrasyonu.
* **[ ]** Enerji Optimizasyon AI: Gereksiz tüketimi otomatik kapatan otonom modül.



## 📸 Ekran Görüntüleri

| Genel Bakış (Dashboard) | Simülasyon Modu |
|:---:|:---:|
| ![Dashboard](./screenshots/dashboard.png) | ![Simulation](./screenshots/simulation.png) |
| *Canlı veri akışı ve KPI takibi* | *Senaryo bazlı analiz ve tahminleme* |

| Varlık Sağlığı | Güvenlik & Bakım |
|:---:|:---:|
| ![Asset Health](./screenshots/asset-health.png) | ![Security](./screenshots/security.png) |
| *Önleyici bakım ve cihaz durumu* | *Kritik olay yönetimi* |

