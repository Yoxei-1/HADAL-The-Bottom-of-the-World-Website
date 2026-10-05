/* All expedition content — zones, creatures, specs, navigation. */

export const MAX_DEPTH = 10911;

export type Zone = {
  id: string;
  numeral: string;
  name: string;
  /** depth the gauge tick sits at */
  tickDepth: number;
  /** registered depth range for the scroll engine */
  start: number;
  end: number;
};

export const ZONES: Zone[] = [
  { id: "surface", numeral: "00", name: "SURFACE", tickDepth: 0, start: 0, end: 25 },
  { id: "sunlight", numeral: "I", name: "SUNLIGHT", tickDepth: 200, start: 25, end: 200 },
  { id: "twilight", numeral: "II", name: "TWILIGHT", tickDepth: 1000, start: 200, end: 1000 },
  { id: "midnight", numeral: "III", name: "MIDNIGHT", tickDepth: 4000, start: 1000, end: 4000 },
  { id: "abyss", numeral: "IV", name: "ABYSS", tickDepth: 6000, start: 4000, end: 6400 },
  { id: "hadal", numeral: "V", name: "HADAL", tickDepth: 10911, start: 6400, end: 10300 },
];

export const NAV_ITEMS = ZONES.map((z) => ({
  id: z.id,
  label: z.name,
  numeral: z.numeral,
  depth: `${z.tickDepth.toLocaleString("en-US")} M`,
}));

export type Creature = {
  img: string;
  name: string;
  meta: string;
  depth: string;
  /** position within the stage, percent */
  x: number;
  y: number;
  /** width as percent of stage width */
  w: number;
  /** parallax speed factor */
  speed: number;
};

export const CREATURES: Creature[] = [
  {
    img: "/images/siphonophore.jpg",
    name: "PRAYA DUBIA",
    meta: "SIPHONOPHORE — LONGER THAN A BLUE WHALE",
    depth: "2,150 M",
    x: 50,
    y: 20,
    w: 54,
    speed: 0.45,
  },
  {
    img: "/images/atolla.jpg",
    name: "ATOLLA WYVILLEI",
    meta: "CROWN JELLY — BIOLUMINESCENT ALARM",
    depth: "3,040 M",
    x: 17,
    y: 50,
    w: 21,
    speed: 0.85,
  },
  {
    img: "/images/anglerfish.jpg",
    name: "MELANOCETUS JOHNSONII",
    meta: "HUMPBACK ANGLERFISH — SELF-LIT LURE",
    depth: "2,850 M",
    x: 71,
    y: 60,
    w: 25,
    speed: 0.7,
  },
  {
    img: "/images/dumbo.jpg",
    name: "GRIMPOTEUTHIS",
    meta: "DUMBO OCTOPUS — DEEPEST OCTOPUS KNOWN",
    depth: "3,960 M",
    x: 39,
    y: 73,
    w: 18,
    speed: 1.05,
  },
];

export const SPECS: [string, string][] = [
  ["CREW", "THREE — PILOT, SCIENCE, SYSTEMS"],
  ["RATED DEPTH", "12,000 M — PAST EVERY FLOOR ON EARTH"],
  ["PRESSURE HULL", "90 MM GRADE-5 TITANIUM SPHERE"],
  ["VIEWPORTS", "3 × 180 MM ACRYLIC, CONICAL"],
  ["ENDURANCE", "96 HOURS LIFE SUPPORT"],
  ["MASS IN AIR", "11.4 TONNES"],
  ["PROPULSION", "6 × 5.5 KW HUB-LESS THRUSTERS"],
  ["LIGHTS", "8 × 6,200-LUMEN DEEP-SEA LED"],
];

export const DIVE_LOG: [string, string][] = [
  ["03:12", "PASSED 6,000 M — HULL NOMINAL"],
  ["03:47", "FIRST CONTACT — GRIMPOTEUTHIS, STARBOARD"],
  ["04:19", "SEDIMENT CLOUD — VISIBILITY FOUR METRES"],
  ["05:02", "BOTTOM IN SIGHT"],
  ["05:11", "TOUCHDOWN — 10,911 M"],
];

export const COORDS = "11°22.4′N 142°35.5′E — CHALLENGER DEEP";
