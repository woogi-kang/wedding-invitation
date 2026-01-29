// 네비게이션 서비스 로고 아이콘
import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

// 네이버지도 아이콘 (공식 스타일 기반)
export function NaverMapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#03C75A" />
      <path
        d="M13.87 12.37L10.2 7H7.5V17H10.13V11.63L13.8 17H16.5V7H13.87V12.37Z"
        fill="white"
      />
    </svg>
  );
}

// 카카오맵 아이콘 (카카오 말풍선 + 핀 스타일)
export function KakaoMapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#FEE500" />
      <path
        d="M12 4.5C8.41 4.5 5.5 6.81 5.5 9.62C5.5 11.42 6.73 12.99 8.56 13.88L7.84 16.73C7.79 16.92 8.01 17.08 8.17 16.97L11.56 14.68C11.7 14.69 11.85 14.7 12 14.7C15.59 14.7 18.5 12.39 18.5 9.58C18.5 6.81 15.59 4.5 12 4.5Z"
        fill="#391B1B"
      />
      <circle cx="12" cy="9.5" r="1.2" fill="#FEE500" />
      <path
        d="M12 11.5L12 13"
        stroke="#FEE500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 티맵 아이콘 (그라데이션 T 스타일)
export function TmapIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="tmapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A5FCD" />
          <stop offset="50%" stopColor="#6B5CE7" />
          <stop offset="100%" stopColor="#E74C8B" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#tmapGradient)" />
      <path
        d="M7 8.5H17M12 8.5V17"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
