export type Office = { lat: number; lng: number; radiusM: number };
export type Fix = { lat: number; lng: number; accuracyM: number };
export type GeoResult = {
  ok: boolean; // false = we cannot trust this reading
  inside: boolean;
  distM: number;
  reason: "INSIDE" | "OUTSIDE" | "LOW_ACCURACY" | "INVALID_FIX";
};

export function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// The server decides. The browser/agent only reports a position and its accuracy.
export function evaluate(fix: Fix, office: Office, opt = { maxAccuracyM: 100 }): GeoResult {
  const valid =
    Number.isFinite(fix.lat) && Number.isFinite(fix.lng) && Number.isFinite(fix.accuracyM) &&
    Math.abs(fix.lat) <= 90 && Math.abs(fix.lng) <= 180 && fix.accuracyM >= 0;
  if (!valid) return { ok: false, inside: false, distM: 0, reason: "INVALID_FIX" };
  const distM = Math.round(haversineM(fix, office));
  if (fix.accuracyM > opt.maxAccuracyM) return { ok: false, inside: false, distM, reason: "LOW_ACCURACY" };
  const inside = distM <= office.radiusM;
  return { ok: true, inside, distM, reason: inside ? "INSIDE" : "OUTSIDE" };
}
