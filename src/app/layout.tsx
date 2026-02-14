import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { OG_METADATA } from '@/lib/constants';
import KakaoScript from '@/components/KakaoScript';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { AudioPreloader } from '@/components/ui/AudioPreloader';
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
        width: 1200,
        height: 630,
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
        {/* Preload Hero images for LCP optimization */}
        {/* Desktop: groom & bride split view */}
        <link
          rel="preload"
          href="/images/hero/groom.jpg"
          as="image"
          media="(min-width: 640px)"
        />
        <link
          rel="preload"
          href="/images/hero/bride.jpg"
          as="image"
          media="(min-width: 640px)"
        />
        {/* Mobile: couple together */}
        <link
          rel="preload"
          href="/images/hero/couple.jpg"
          as="image"
          media="(max-width: 639px)"
        />
        {/* Preload background music for faster playback */}
        <link
          rel="preload"
          href="/music/bgm-quick.m4a"
          as="audio"
          type="audio/mp4"
        />
        {/* Wedding Fonts - Elegant & Classic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=Nanum+Myeongjo:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AudioPreloader />
        {children}
        <MusicPlayer />
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
