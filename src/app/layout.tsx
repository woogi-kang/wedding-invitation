import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { OG_METADATA } from '@/lib/constants';
import KakaoScript from '@/components/KakaoScript';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAF9F6',
};

export const metadata: Metadata = {
  metadataBase: new URL(OG_METADATA.url),
  title: OG_METADATA.title,
  description: OG_METADATA.description,
  openGraph: {
    type: 'website',
    title: OG_METADATA.title,
    description: OG_METADATA.description,
    images: [
      {
        url: OG_METADATA.image,
        width: 800,
        height: 400,
        alt: OG_METADATA.title,
      },
    ],
    url: OG_METADATA.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_METADATA.title,
    description: OG_METADATA.description,
    images: [OG_METADATA.image],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
        <KakaoScript />
      </body>
    </html>
  );
}
