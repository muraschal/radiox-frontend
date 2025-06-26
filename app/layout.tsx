import './globals.css'

export const metadata = {
  title: 'RadioX AI - Your Radio, Just Got Smarter',
  description: 'AI-generated. Enterprise quality. Zero compromise. It\'s the future, and it\'s loud.',
  keywords: 'RadioX, AI Radio, Zürich, Intelligent Radio, Smart Radio, AI-generated content',
  authors: [{ name: 'RadioX AI' }],
  openGraph: {
    title: 'RadioX AI - Your Radio, Just Got Smarter',
    description: 'AI-generated. Enterprise quality. Zero compromise. It\'s the future, and it\'s loud.',
    url: 'https://radiox.cloud',
    siteName: 'RadioX AI',
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadioX AI - Your Radio, Just Got Smarter',
    description: 'AI-generated. Enterprise quality. Zero compromise. It\'s the future, and it\'s loud.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📻</text></svg>" />
      </head>
      <body className="bg-radiox-darker text-white min-h-screen">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
} 