/**
 * Keyboard layout map: Cyrillic char → Latin char at same QWERTY position.
 * Used when user types an English word while Russian keyboard is active.
 * e.g. "сщееет" (keys for "cotton" on Russian layout) → "cotton"
 */
const CYR_TO_LAT: Record<string, string> = {
  й:"q", ц:"w", у:"e", к:"r", е:"t", н:"y", г:"u", ш:"i", щ:"o", з:"p",
  ф:"a", ы:"s", в:"d", а:"f", п:"g", р:"h", о:"j", л:"k", д:"l",
  я:"z", ч:"x", с:"c", м:"v", и:"b", т:"n", ь:"m",
};

/**
 * Keyboard layout map: Latin char → Cyrillic char at same QWERTY position.
 * Used when user types a Russian word while Latin keyboard is active.
 * e.g. "c" pressed thinking it's "с" → converted to "с"
 */
const LAT_TO_CYR: Record<string, string> = {
  q:"й", w:"ц", e:"у", r:"к", t:"е", y:"н", u:"г", i:"ш", o:"щ", p:"з",
  a:"ф", s:"ы", d:"в", f:"а", g:"п", h:"р", j:"о", k:"л", l:"д",
  z:"я", x:"ч", c:"с", v:"м", b:"и", n:"т", m:"ь",
};

/**
 * Transliteration: Cyrillic → Latin phonetic.
 * Used to match stored Russian/Uzbek (Cyrillic) names when user types
 * a phonetic Latin spelling (e.g. "xlopok" finds "хлопок").
 */
const TRANSLIT: Record<string, string> = {
  а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"yo", ж:"zh", з:"z",
  и:"i", й:"j", к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r",
  с:"s", т:"t", у:"u", ф:"f", х:"kh", ц:"ts", ч:"ch", ш:"sh",
  щ:"sch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya",
};

function applyMap(str: string, map: Record<string, string>): string {
  return str.toLowerCase().split("").map(c => map[c] ?? c).join("");
}

/**
 * Returns deduplicated list of query variants to try:
 * 1. Original
 * 2. Cyrillic → Latin keyboard conversion
 * 3. Latin → Cyrillic keyboard conversion
 * 4. Cyrillic → Latin transliteration
 */
export function getSearchVariants(q: string): string[] {
  const original = q.trim().toLowerCase();
  if (!original) return [];
  const set = new Set<string>([original]);
  set.add(applyMap(original, CYR_TO_LAT));
  set.add(applyMap(original, LAT_TO_CYR));
  set.add(applyMap(original, TRANSLIT));
  return Array.from(set).filter(Boolean);
}

/**
 * Builds a flat Prisma OR array that searches all language fields
 * for every query variant. Returns null when query is empty.
 */
export function buildSearchOR(q: string) {
  const variants = getSearchVariants(q);
  if (!variants.length) return null;

  return variants.flatMap(v => [
    { name:          { contains: v, mode: "insensitive" as const } },
    { nameRu:        { contains: v, mode: "insensitive" as const } },
    { nameUz:        { contains: v, mode: "insensitive" as const } },
    { description:   { contains: v, mode: "insensitive" as const } },
    { descriptionRu: { contains: v, mode: "insensitive" as const } },
    { descriptionUz: { contains: v, mode: "insensitive" as const } },
    { company: { name:   { contains: v, mode: "insensitive" as const } } },
    { company: { nameRu: { contains: v, mode: "insensitive" as const } } },
    { company: { nameUz: { contains: v, mode: "insensitive" as const } } },
  ]);
}
