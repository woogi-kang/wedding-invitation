'use client';

import { Gallery } from '@/components/sections/Gallery';
import type { DynamicGalleryProps } from '../types';

// Gallery 컴포넌트는 이미 images props를 받으므로 그대로 래핑
export function DynamicGallery({ images }: DynamicGalleryProps) {
  return <Gallery images={images} />;
}
