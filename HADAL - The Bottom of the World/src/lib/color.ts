/* Depth-keyed background colour journey + hex interpolation helpers. */

export type ColorStop = [depth: number, hex: string];

/** The ocean's palette, keyed by metres below sea level. */
export const DEPTH_STOPS: ColorStop[] = [
  [0, "#e7eeeb"],
  [90, "#93bac4"],
  [200, "#15586c"],
  [420, "#0a3348"],
  [1000, "#062237"],
  [2000, "#041526"],
  [4000, "#020b16"],
  [6000, "#01060e"],
  [9000, "#01040a"],
  [10911, "#010306"],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function colorAtDepth(depth: number): string {
  const stops = DEPTH_STOPS;
  if (depth <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [d1, c1] = stops[i];
    if (depth <= d1) {
      const [d0, c0] = stops[i - 1];
      const t = (depth - d0) / (d1 - d0);
      const a = hexToRgb(c0);
      const b = hexToRgb(c1);
      const r = Math.round(a[0] + (b[0] - a[0]) * t);
      const g = Math.round(a[1] + (b[1] - a[1]) * t);
      const bl = Math.round(a[2] + (b[2] - a[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }
  }
  return stops[stops.length - 1][1];
}

/** Piecewise-interpolated scalar keyed by depth (temperature etc.) */
export function scalarAtDepth(stops: [number, number][], depth: number): number {
  if (depth <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [d1, v1] = stops[i];
    if (depth <= d1) {
      const [d0, v0] = stops[i - 1];
      return v0 + (v1 - v0) * ((depth - d0) / (d1 - d0));
    }
  }
  return stops[stops.length - 1][1];
}
