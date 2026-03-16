/**
 * Guest Snap Status API Route
 * GET: Check service status and storage availability
 */

import { NextResponse } from 'next/server';
import { checkStorageStatus } from '@/lib/guestsnap';
import { GUEST_SNAP_CONFIG } from '@/lib/constants';
import type { StatusResponse } from '@/types/guestsnap';

export async function GET(): Promise<NextResponse<StatusResponse>> {
  try {
    // Check if feature is enabled
    if (!GUEST_SNAP_CONFIG.enabled) {
      return NextResponse.json({
        serviceEnabled: false,
        storageAvailable: false,
        configurationValid: false,
        authMode: 'unconfigured',
        currentUploads: 0,
        maxConcurrentUploads: GUEST_SNAP_CONFIG.limits.maxConcurrentUploads,
      });
    }

    // Check Google Drive status
    const storageStatus = await checkStorageStatus();

    return NextResponse.json({
      serviceEnabled: GUEST_SNAP_CONFIG.enabled,
      storageAvailable: storageStatus.available,
      configurationValid: storageStatus.configurationValid,
      authMode: storageStatus.authMode,
      storageErrorCode: storageStatus.errorCode,
      currentUploads: 0, // Could track this with a counter if needed
      maxConcurrentUploads: GUEST_SNAP_CONFIG.limits.maxConcurrentUploads,
    });
  } catch (error) {
    console.error('Status check error:', error);

    return NextResponse.json({
      serviceEnabled: GUEST_SNAP_CONFIG.enabled,
      storageAvailable: false,
      configurationValid: false,
      authMode: 'unconfigured',
      storageErrorCode: 'unknown',
      currentUploads: 0,
      maxConcurrentUploads: GUEST_SNAP_CONFIG.limits.maxConcurrentUploads,
    });
  }
}

/**
 * HEAD: Quick health check
 */
export async function HEAD(): Promise<NextResponse> {
  try {
    if (!GUEST_SNAP_CONFIG.enabled) {
      return new NextResponse(null, { status: 503 });
    }

    const storageStatus = await checkStorageStatus();

    if (!storageStatus.available) {
      return new NextResponse(null, { status: 503 });
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
