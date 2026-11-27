/**
 * Shared browser geolocation utility for office check-in and attendance verification.
 * Supports high-accuracy satellite GPS with graceful fallback to cellular/Wi-Fi triangulation.
 */

export type BrowserLocationResult = {
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  locationError?: 'denied' | 'timeout' | 'unavailable' | 'unsupported';
  sourceAccuracy?: 'high' | 'network';
};

export async function captureBrowserLocation(): Promise<BrowserLocationResult> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return { locationError: 'unsupported' };
  }

  // Strategy 1: Attempt High Accuracy (GPS satellite hardware lock, 7s timeout, allows 30s cached fix)
  const tryHighAccuracy = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 30000,
      });
    });

  // Strategy 2: Fallback to Low Accuracy (Wi-Fi access points + Cellular triangulation, 12s timeout, allows 3min cached fix)
  const tryLowAccuracy = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 180000,
      });
    });

  try {
    let pos: GeolocationPosition;
    let source: 'high' | 'network' = 'high';

    try {
      pos = await tryHighAccuracy();
    } catch (err: unknown) {
      const geoErr = err as GeolocationPositionError;
      // If user explicitly denied permission, do not retry, return 'denied' immediately
      if (geoErr && typeof geoErr.code === 'number' && geoErr.code === 1) {
        return { locationError: 'denied' };
      }
      // Fallback to network/cell fix
      pos = await tryLowAccuracy();
      source = 'network';
    }

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracyMeters: Math.round(pos.coords.accuracy),
      sourceAccuracy: source,
    };
  } catch (err: unknown) {
    const geoErr = err as GeolocationPositionError;
    if (geoErr && typeof geoErr.code === 'number') {
      if (geoErr.code === 1) return { locationError: 'denied' };
      if (geoErr.code === 3) return { locationError: 'timeout' };
      return { locationError: 'unavailable' };
    }
    return { locationError: 'unavailable' };
  }
}
