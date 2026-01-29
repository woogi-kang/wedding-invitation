// 네비게이션 서비스 로고 아이콘
import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

// 네이버지도 아이콘
export function NaverMapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="24" height="24" rx="4" fill="#03C75A" />
      <path
        d="M14.5 7.5L9.5 12L14.5 16.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(180 12 12)"
      />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial"
      >
        N
      </text>
    </svg>
  );
}

// 카카오맵 아이콘
export function KakaoMapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="24" height="24" rx="4" fill="#FEE500" />
      <path
        d="M12 5C8.13 5 5 7.52 5 10.6C5 12.54 6.3 14.24 8.27 15.2L7.5 18.5C7.45 18.7 7.68 18.87 7.85 18.75L11.5 16.1C11.66 16.11 11.83 16.12 12 16.12C15.87 16.12 19 13.6 19 10.52C19 7.52 15.87 5 12 5Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

// 티맵 아이콘
export function TmapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="24" height="24" rx="4" fill="#EF4123" />
      <path
        d="M6 8H18M12 8V17"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
