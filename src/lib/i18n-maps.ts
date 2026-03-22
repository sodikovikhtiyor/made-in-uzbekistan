/**
 * Reverse maps from English DB values to translation keys.
 * Used to translate category/industry/region values stored in DB.
 */

export const industryKeyMap: Record<string, string> = {
  "Textiles & Apparel": "textiles",
  "Food & Agriculture": "food",
  "Building Materials": "building",
  "Minerals & Metals": "minerals",
  "Leather & Footwear": "leather",
  "Electronics": "electronics",
  "Chemicals": "chemicals",
  "Furniture": "furniture",
  "Other": "other",
};

export const regionKeyMap: Record<string, string> = {
  "Tashkent": "tashkent",
  "Samarkand": "samarkand",
  "Bukhara": "bukhara",
  "Fergana": "fergana",
  "Namangan": "namangan",
  "Andijan": "andijan",
  "Kashkadarya": "kashkadarya",
  "Surkhandarya": "surkhandarya",
  "Khorezm": "khorezm",
  "Navoi": "navoi",
  "Jizzakh": "jizzakh",
  "Syrdarya": "syrdarya",
  "Karakalpakstan": "karakalpakstan",
};

export const categoryKeyMap: Record<string, string> = {
  "Textiles & Apparel": "textiles",
  "Food & Agriculture": "food",
  "Building Materials": "building",
  "Minerals & Metals": "minerals",
  "Leather & Footwear": "leather",
  "Electronics": "electronics",
  "Chemicals": "chemicals",
  "Handicrafts": "handicrafts",
};
