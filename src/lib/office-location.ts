// Pure GPS geofencing & distance verification helpers for Dhaka office attendance.
// Contains zero Node built-ins so browser, server, and test runners can share it.

export const DEFAULT_OFFICE_LATITUDE = 23.7401435;
export const DEFAULT_OFFICE_LONGITUDE = 90.3713009;
export const DEFAULT_OFFICE_RADIUS_METERS = 250;
export const DEFAULT_OFFICE_LABEL = 'Dhanmondi Office (House 12/1, Road 4/A)';

export type OfficeLocationStatus =
  | 'office_location'
  | 'remote_location'
  | 'location_denied'
  | 'location_unavailable'
  | 'manual'
  | 'unverified';

export interface OfficeGeofenceConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  strictLocation: boolean;
  isCustom: boolean;
}

export interface LocationClassification {
  locationType: OfficeLocationStatus;
  locationLabel: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  distanceMeters: number | null;
  mapsUrl: string | null;
}

export interface AttendanceLocationStatus {
  locationType: OfficeLocationStatus;
  locationLabel: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  distanceMeters: number | null;
  mapsUrl: string | null;
}

const EARTH_RADIUS_METERS = 6_371_000;
const LOC_TAG_RE = /\[LOC:\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:\s+±(\d+)m)?(?:\s*\|\s*(\d+)m)?\]/i;
const LEGACY_IP_TAG_RE = /\[IP:\s*[^\]]+\]/gi;

export function parseValidCoordinate(raw: unknown, kind: 'lat' | 'lng'): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  const num = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(num)) return null;
  if (kind === 'lat' && (num < -90 || num > 90)) return null;
  if (kind === 'lng' && (num < -180 || num > 180)) return null;
  return Number(num.toFixed(7));
}

export function validateCoordinateInput(
  raw: string,
  kind: 'lat' | 'lng',
): { normalized?: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { normalized: '' };
  const parsed = parseValidCoordinate(trimmed, kind);
  if (parsed === null) {
    return {
      error:
        kind === 'lat'
          ? 'Office latitude must be a decimal number between -90 and 90 (e.g. 23.7401435).'
          : 'Office longitude must be a decimal number between -180 and 180 (e.g. 90.3713009).',
    };
  }
  return { normalized: String(parsed) };
}

export function validateRadiusMetersInput(raw: string): { normalized?: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { normalized: '' };
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num) || num < 50 || num > 10000) {
    return { error: 'Allowed office radius must be a whole number between 50 and 10,000 meters.' };
  }
  return { normalized: String(num) };
}

export function resolveOfficeGeofenceConfig(
  settings: Record<string, string | undefined>,
): OfficeGeofenceConfig {
  const customLat = parseValidCoordinate(settings.officeLatitude, 'lat');
  const customLng = parseValidCoordinate(settings.officeLongitude, 'lng');
  const rawRadius = settings.officeRadiusMeters ? Number(settings.officeRadiusMeters.trim()) : NaN;
  const validRadius =
    Number.isFinite(rawRadius) && rawRadius >= 50 && rawRadius <= 10000
      ? Math.round(rawRadius)
      : DEFAULT_OFFICE_RADIUS_METERS;

  const hasCustomCoords = customLat !== null && customLng !== null;
  return {
    latitude: hasCustomCoords ? customLat : DEFAULT_OFFICE_LATITUDE,
    longitude: hasCustomCoords ? customLng : DEFAULT_OFFICE_LONGITUDE,
    radiusMeters: validRadius,
    strictLocation: settings.officeLocationStrict === 'true',
    isCustom: hasCustomCoords || Boolean(settings.officeRadiusMeters?.trim()),
  };
}

export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const clampedA = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));
  return Math.round(EARTH_RADIUS_METERS * c);
}

export function formatDistanceLabel(meters: number | null): string {
  if (meters === null || !Number.isFinite(meters)) return 'Unknown distance';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(meters >= 10_000 ? 1 : 2)}km`;
}

export function buildGoogleMapsUrl(
  latitude: number | string | null | undefined,
  longitude: number | string | null | undefined,
): string | null {
  const lat = parseValidCoordinate(latitude, 'lat');
  const lng = parseValidCoordinate(longitude, 'lng');
  if (lat === null || lng === null) return null;
  return `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
}

export function classifyCheckInLocation(
  input: {
    latitude?: unknown;
    longitude?: unknown;
    accuracyMeters?: unknown;
    locationError?: unknown;
  },
  geofence: OfficeGeofenceConfig,
): LocationClassification {
  const lat = parseValidCoordinate(input.latitude, 'lat');
  const lng = parseValidCoordinate(input.longitude, 'lng');
  const rawAcc =
    typeof input.accuracyMeters === 'number'
      ? input.accuracyMeters
      : typeof input.accuracyMeters === 'string' && input.accuracyMeters.trim()
        ? Number(input.accuracyMeters)
        : NaN;
  const accuracyMeters =
    Number.isFinite(rawAcc) && rawAcc >= 0 && rawAcc <= 100_000 ? Math.round(rawAcc) : null;

  if (lat !== null && lng !== null) {
    const distanceMeters = calculateDistanceMeters(lat, lng, geofence.latitude, geofence.longitude);
    const roundedLat = Number(lat.toFixed(5));
    const roundedLng = Number(lng.toFixed(5));
    const mapsUrl = buildGoogleMapsUrl(roundedLat, roundedLng);
    const inOffice = distanceMeters <= geofence.radiusMeters;
    const distLabel = formatDistanceLabel(distanceMeters);
    return {
      locationType: inOffice ? 'office_location' : 'remote_location',
      locationLabel: inOffice ? `Office Zone (${distLabel})` : `Remote (${distLabel} away)`,
      latitude: roundedLat,
      longitude: roundedLng,
      accuracyMeters,
      distanceMeters,
      mapsUrl,
    };
  }

  const errCode = typeof input.locationError === 'string' ? input.locationError.trim().toLowerCase() : '';
  if (errCode === 'denied' || errCode === 'permission_denied') {
    return {
      locationType: 'location_denied',
      locationLabel: 'GPS Permission Denied',
      latitude: null,
      longitude: null,
      accuracyMeters: null,
      distanceMeters: null,
      mapsUrl: null,
    };
  }

  return {
    locationType: 'location_unavailable',
    locationLabel: 'GPS Unavailable',
    latitude: null,
    longitude: null,
    accuracyMeters: null,
    distanceMeters: null,
    mapsUrl: null,
  };
}

export function parseCheckInLocationFromNotes(notes?: string | null): {
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  distanceMeters: number | null;
} {
  if (!notes) {
    return { latitude: null, longitude: null, accuracyMeters: null, distanceMeters: null };
  }
  const match = LOC_TAG_RE.exec(notes);
  if (!match) {
    return { latitude: null, longitude: null, accuracyMeters: null, distanceMeters: null };
  }
  const latitude = parseValidCoordinate(match[1], 'lat');
  const longitude = parseValidCoordinate(match[2], 'lng');
  const accuracyMeters = match[3] ? Number(match[3]) : null;
  const distanceMeters = match[4] ? Number(match[4]) : null;
  return {
    latitude,
    longitude,
    accuracyMeters: Number.isFinite(accuracyMeters) ? accuracyMeters : null,
    distanceMeters: Number.isFinite(distanceMeters) ? distanceMeters : null,
  };
}

export function appendCheckInLocationNote(
  existingNotes: string | null | undefined,
  classification: LocationClassification,
): string | null {
  const cleanedBase = (existingNotes || '')
    .replace(LOC_TAG_RE, '')
    .replace(LEGACY_IP_TAG_RE, '')
    .replace(
      /(?:\s*·\s*)?(Office Zone \([^)]+\)|Remote \([^)]+\)|GPS Permission Denied|GPS Unavailable|Dhaka Office Wi-Fi|Remote \/ Mobile Network|Workspace Check-In)\s*/gi,
      '',
    )
    .replace(/^\s*·\s*|\s*·\s*$/g, '')
    .trim();

  let auditTag: string = classification.locationLabel;
  if (classification.latitude !== null && classification.longitude !== null) {
    const accPart = classification.accuracyMeters !== null ? ` ±${classification.accuracyMeters}m` : '';
    const distPart = classification.distanceMeters !== null ? ` | ${classification.distanceMeters}m` : '';
    auditTag = `[LOC: ${classification.latitude.toFixed(5)},${classification.longitude.toFixed(5)}${accPart}${distPart}] · ${classification.locationLabel}`;
  }

  // Always preserve the [LOC: ...] audit tag within the 300-character limit.
  const maxBaseLen = Math.max(0, 300 - auditTag.length - 3);
  const cappedBase = cleanedBase && maxBaseLen > 0 ? cleanedBase.slice(0, maxBaseLen).trim() : '';
  const combined = cappedBase ? `${cappedBase} · ${auditTag}` : auditTag;
  return combined.slice(0, 300);
}

export function resolveAttendanceLocationStatus(
  source?: string | null,
  notes?: string | null,
): AttendanceLocationStatus {
  const parsed = parseCheckInLocationFromNotes(notes);
  const mapsUrl = buildGoogleMapsUrl(parsed.latitude, parsed.longitude);
  const distLabel = parsed.distanceMeters !== null ? formatDistanceLabel(parsed.distanceMeters) : null;

  if (source === 'office_location') {
    return {
      locationType: 'office_location',
      locationLabel: distLabel ? `Office Zone (${distLabel})` : 'Office Zone',
      ...parsed,
      mapsUrl,
    };
  }
  if (source === 'remote_location') {
    return {
      locationType: 'remote_location',
      locationLabel: distLabel ? `Remote (${distLabel} away)` : 'Remote Location',
      ...parsed,
      mapsUrl,
    };
  }
  if (source === 'location_denied') {
    return {
      locationType: 'location_denied',
      locationLabel: 'GPS Permission Denied',
      ...parsed,
      mapsUrl,
    };
  }
  if (source === 'location_unavailable') {
    return {
      locationType: 'location_unavailable',
      locationLabel: 'GPS Unavailable',
      ...parsed,
      mapsUrl,
    };
  }
  if (source === 'manual') {
    return {
      locationType: 'manual',
      locationLabel: 'Admin Manual Entry',
      ...parsed,
      mapsUrl,
    };
  }
  return {
    locationType: 'unverified',
    locationLabel: 'No GPS Data',
    ...parsed,
    mapsUrl,
  };
}
