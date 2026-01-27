/**
 * useBeforeUnload Hook
 * Warns user when trying to close browser/tab during upload
 * Based on SPEC-GUESTSNAP-001 M4.6
 */

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

interface UseBeforeUnloadOptions {
  /** Whether to show the warning */
  enabled: boolean;
  /** Custom message (not shown in most modern browsers but used for internal state) */
  message?: string;
}

/**
 * Hook to warn users before leaving the page during critical operations
 * Most modern browsers show a generic message, but this ensures the dialog appears
 */
export function useBeforeUnload({ enabled, message }: UseBeforeUnloadOptions): void {
  const enabledRef = useRef(enabled);
  const messageRef = useRef(message);

  // Keep refs in sync
  useEffect(() => {
    enabledRef.current = enabled;
    messageRef.current = message;
  }, [enabled, message]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!enabledRef.current) return;

    // Standard way to show confirmation dialog
    e.preventDefault();
    // Required for Chrome
    e.returnValue = messageRef.current || '';
    return messageRef.current || '';
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);
}

/**
 * Hook for managing page visibility changes
 * Useful for pausing/resuming operations when tab is hidden
 */
export function usePageVisibility(
  onVisible?: () => void,
  onHidden?: () => void
): boolean {
  const callbacksRef = useRef({ onVisible, onHidden });
  const [isVisible, setIsVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  );

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onVisible, onHidden };
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);

      if (visible) {
        callbacksRef.current.onVisible?.();
      } else {
        callbacksRef.current.onHidden?.();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
}
