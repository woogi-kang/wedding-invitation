'use client';

import Script from 'next/script';
import { KAKAO_CONFIG } from '@/lib/constants';

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
    };
  }
}

export default function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_CONFIG.javascriptKey) {
          window.Kakao.init(KAKAO_CONFIG.javascriptKey);
        }
      }}
    />
  );
}
