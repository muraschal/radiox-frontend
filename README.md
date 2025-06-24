# RadioX Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

> **Moderne React-Frontend-Anwendung für die RadioX AI Radio Platform**

Eine benutzerfreundliche, responsive Web-App mit Glassmorphism-Design und Echtzeit-Features für Radio-Streaming.

---

## 🎯 Was ist RadioX?

RadioX ist eine KI-gesteuerte Radio-Plattform, die personalisierte Musikerlebnisse bietet. Diese Frontend-Anwendung ermöglicht es Benutzern, Live-Shows zu verfolgen, Musik zu streamen und mit der Community zu interagieren.

### ✨ Hauptfunktionen

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| 📱 **Responsive Design** | ✅ Verfügbar | Optimiert für alle Geräte |
| 🎨 **Glassmorphism UI** | ✅ Verfügbar | Modernes, transluzentes Design |
| 🌙 **Dark Theme** | ✅ Verfügbar | Augenschonende Benutzeroberfläche |
| 📺 **Live Show Display** | 🔄 In Entwicklung | Echtzeitanzeige aktueller Shows |
| 🎵 **Audio Player** | 🔄 In Entwicklung | Integrierter Musik-Player |
| ⚡ **Real-time Updates** | 📋 Geplant | Live-Synchronisation |

---

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18.0+ 
- npm oder yarn
- Git

### 1️⃣ Repository klonen
```bash
git clone https://github.com/[username]/radiox-frontend.git
cd radiox-frontend
```

### 2️⃣ Abhängigkeiten installieren
```bash
npm install
```

### 3️⃣ Umgebungsvariablen konfigurieren
Erstelle eine `.env.local` Datei:
```bash
# Supabase Konfiguration
NEXT_PUBLIC_SUPABASE_URL=https://zwcvvbgkqhexfcldwuxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein_supabase_anon_key

# API Endpunkt
NEXT_PUBLIC_API_URL=https://api.radiox.cloud
```

### 4️⃣ Entwicklungsserver starten
```bash
npm run dev
```

🎉 **Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser**

---

## 🏗️ Projektstruktur

```
radiox-frontend/
├── 📁 app/                    # Next.js App Router
│   ├── 📄 layout.tsx         # Haupt-Layout Komponente
│   ├── 📄 page.tsx           # Homepage
│   ├── 📄 globals.css        # Globale Styles
│   └── 📁 api/               # API Routes
│       ├── 📁 audio/         # Audio-Verarbeitung
│       ├── 📁 generate-audio/ # Audio-Generierung
│       └── 📁 generate-show/ # Show-Generierung
├── 📁 components/            # Wiederverwendbare Komponenten
├── 📁 lib/                   # Hilfsfunktionen & Utilities
├── 📁 public/                # Statische Assets
└── 📄 README.md              # Diese Dokumentation
```

---

## 🔧 Technologie-Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React Framework mit App Router
- **[TypeScript](https://typescriptlang.org/)** - Typsicherheit und bessere Entwicklererfahrung
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS Framework

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (Datenbank, Auth, Realtime)
- **[Vercel](https://vercel.com/)** - Deployment und Hosting Platform

### Entwicklung
- **ESLint** - Code-Qualität und Konsistenz
- **Prettier** - Code-Formatierung
- **TypeScript** - Statische Typisierung

---

## 🌐 Deployment

### Automatisches Deployment mit Vercel

1. **Repository mit Vercel verbinden**
   - Gehe zu [vercel.com](https://vercel.com)
   - Klicke "New Project" → Importiere dein GitHub Repository

2. **Umgebungsvariablen konfigurieren**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=deine_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=dein_supabase_key
   NEXT_PUBLIC_API_URL=https://api.radiox.cloud
   ```

3. **Deploy automatisch bei Git Push** 🚀

### Custom Domain Setup

```bash
# DNS Konfiguration in Cloudflare
A     radiox.cloud      → Vercel IP (automatisch)
CNAME www.radiox.cloud  → radiox.cloud
```

---

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Responsive Landing Page
- [x] Glassmorphism UI Design
- [x] Dark Theme Implementation
- [x] Basic Project Structure

### Phase 2: Backend Integration 🔄
- [ ] Supabase Database Setup
- [ ] User Authentication
- [ ] API Integration
- [ ] Data Fetching

### Phase 3: Core Features 📋
- [ ] Live Show Display
- [ ] Audio Player Component
- [ ] Real-time Updates
- [ ] User Dashboard

### Phase 4: Advanced Features 🔮
- [ ] Push Notifications
- [ ] Offline Support
- [ ] Performance Optimizations
- [ ] Analytics Integration

---

## 🤝 Beitragen

Wir freuen uns über jeden Beitrag! 

### Entwicklung lokal
1. Fork das Repository
2. Erstelle einen Feature Branch: `git checkout -b feature/amazing-feature`
3. Committe deine Änderungen: `git commit -m 'Add amazing feature'`
4. Push zum Branch: `git push origin feature/amazing-feature`
5. Öffne einen Pull Request

### Code Style
- Verwende TypeScript für alle neuen Dateien
- Folge der bestehenden Tailwind CSS Konvention
- Schreibe aussagekräftige Commit Messages

---

## 📚 Weitere Ressourcen

- 📖 **[Next.js Dokumentation](https://nextjs.org/docs)**
- 🎨 **[Tailwind CSS Dokumentation](https://tailwindcss.com/docs)**
- 🗄️ **[Supabase Dokumentation](https://supabase.com/docs)**
- 🚀 **[Vercel Dokumentation](https://vercel.com/docs)**

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

---

<div align="center">

**Entwickelt mit ❤️ für die RadioX Community**

[Website](https://radiox.cloud) • [API Docs](https://api.radiox.cloud/docs) • [Support](mailto:support@radiox.cloud)

</div> 