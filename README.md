# RadioX Frontend

Modern React frontend for RadioX AI Radio platform.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env.local with:
   NEXT_PUBLIC_SUPABASE_URL=https://zwcvvbgkqhexfcldwuxq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=https://api.radiox.cloud
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect GitHub repo to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on push**

### Custom Domain Setup

1. **Add domain in Vercel:** `radiox.cloud`
2. **Configure DNS in Cloudflare:**
   ```
   A     radiox.cloud          → Vercel IP
   CNAME www.radiox.cloud      → radiox.cloud
   ```

## 🔧 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database
- **Vercel** - Hosting

## 📁 Project Structure

```
radiox-frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # Reusable components
├── lib/                 # Utilities
└── public/             # Static assets
```

## 🎯 Features

- [x] Responsive design
- [x] Glassmorphism UI
- [x] Dark theme
- [ ] Live show display
- [ ] Supabase integration
- [ ] Real-time updates
- [ ] Audio player

## 🚀 Roadmap

1. **Phase 1:** Basic landing page ✅
2. **Phase 2:** Supabase integration
3. **Phase 3:** Live show display
4. **Phase 4:** Real-time features
5. **Phase 5:** Audio streaming 