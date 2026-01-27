/**
 * useOfflineSync Hook
 * Handles network status detection and offline/online transitions
 * Based on SPEC-GUESTSNAP-001 M3.3
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type NetworkStatus = 'online' | 'offline' | 'unknown';

interface UseOfflineSyncOptions {
  /** Callback when network comes back online */
  onOnline?: () => void;
  /** Callback when network goes offline */
  onOffline?: () => void;
  /** Callback when network status changes */
  onStatusChange?: (status: NetworkStatus) => void;
  /** Interval for checking network status (ms) */
  checkInterval?: number;
  /** URL to ping for connectivity check (optional) */
  pingUrl?: string;
}

interface UseOfflineSyncReturn {
  /** Current network status */
  networkStatus: NetworkStatus;
  /** Whether currently online */
  isOnline: boolean;
  /** Whether currently offline */
  isOffline: boolean;
  /** Last time online was detected */
  lastOnlineAt: Date | null;
  /** Force check network status */
  checkNetworkStatus: () => Promise<boolean>;
  /** Time since last online (in seconds) */
  offlineDuration: number;
}

/**
 * Hook for monitoring network connectivity and handling offline/online transitions
 */
export function useOfflineSync(options: UseOfflineSyncOptions = {}): UseOfflineSyncReturn {
  const {
    onOnline,
    onOffline,
    onStatusChange,
    checkInterval = 30000, // Check every 30 seconds
    pingUrl,
  } = options;

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('unknown');
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);
  const [offlineDuration, setOfflineDuration] = useState(0);

  // Refs for callbacks to avoid stale closures
  const onOnlineRef = useRef(onOnline);
  const onOfflineRef = useRef(onOffline);
  const onStatusChangeRef = useRef(onStatusChange);
  const previousStatusRef = useRef<NetworkStatus>('unknown');

  // Update refs when callbacks change
  useEffect(() => {
    onOnlineRef.current = onOnline;
    onOfflineRef.current = onOffline;
    onStatusChangeRef.current = onStatusChange;
  }, [onOnline, onOffline, onStatusChange]);

  /**
   * Check if network is available by making a request
   * Uses a lightweight approach to minimize bandwidth
   */
  const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
    // First check navigator.onLine
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return false;
    }

    // If a ping URL is provided, try to reach it
    if (pingUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(pingUrl, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        return false;
      }
    }

    // Default to navigator.onLine
    return navigator.onLine;
  }, [pingUrl]);

  /**
   * Update network status
   */
  const updateNetworkStatus = useCallback(
    (isOnline: boolean) => {
      const newStatus: NetworkStatus = isOnline ? 'online' : 'offline';

      setNetworkStatus((currentStatus) => {
        // Only trigger callbacks if status actually changed
        if (currentStatus !== newStatus) {
          // Update last online time and reset offline duration when coming online
          if (isOnline) {
            setLastOnlineAt(new Date());
            setOfflineDuration(0);
          }

          // Call appropriate callback
          if (isOnline && previousStatusRef.current === 'offline') {
            onOnlineRef.current?.();
          } else if (!isOnline && previousStatusRef.current === 'online') {
            onOfflineRef.current?.();
          }

          // Always call status change callback
          onStatusChangeRef.current?.(newStatus);

          previousStatusRef.current = newStatus;
        }

        return newStatus;
      });
    },
    []
  );

  /**
   * Handle online event
   */
  const handleOnline = useCallback(async () => {
    // Double-check with actual network request
    const isReallyOnline = await checkNetworkStatus();
    updateNetworkStatus(isReallyOnline);
  }, [checkNetworkStatus, updateNetworkStatus]);

  /**
   * Handle offline event
   */
  const handleOffline = useCallback(() => {
    updateNetworkStatus(false);
  }, [updateNetworkStatus]);

  // Set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial status check
    const initializeStatus = async () => {
      const isOnline = await checkNetworkStatus();
      updateNetworkStatus(isOnline);
      if (isOnline) {
        setLastOnlineAt(new Date());
      }
    };

    initializeStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check
    const intervalId = setInterval(async () => {
      const isOnline = await checkNetworkStatus();
      updateNetworkStatus(isOnline);
    }, checkInterval);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkNetworkStatus, updateNetworkStatus, handleOnline, handleOffline, checkInterval]);

  // Track offline duration - only increment when offline
  useEffect(() => {
    if (networkStatus !== 'offline') {
      return;
    }

    const intervalId = setInterval(() => {
      setOfflineDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [networkStatus]);

  // Visibility change handling - check network when tab becomes visible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const isOnline = await checkNetworkStatus();
        updateNetworkStatus(isOnline);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkNetworkStatus, updateNetworkStatus]);

  return {
    networkStatus,
    isOnline: networkStatus === 'online',
    isOffline: networkStatus === 'offline',
    lastOnlineAt,
    checkNetworkStatus,
    offlineDuration,
  };
}

/**
 * Simple hook for just online/offline status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
