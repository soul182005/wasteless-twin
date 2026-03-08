// Digital Twin Engine - Spoilage Prediction

const IDEAL_TEMP = 4; // °C (refrigerator temperature)
const DEGRADATION_FACTOR = 0.05;

export function predictSpoilage(currentTemp: number, expiryHours: number) {
  const tempExcess = Math.max(0, currentTemp - IDEAL_TEMP);
  const degradationMultiplier = 1 + tempExcess * DEGRADATION_FACTOR;
  const actualShelfLife = expiryHours / degradationMultiplier;
  return Math.round(actualShelfLife * 10) / 10;
}

export function simulateFutureTemps(baseTemp: number, hours: number): { hour: number; temp: number; remaining: number }[] {
  const data: { hour: number; temp: number; remaining: number }[] = [];
  let remaining = hours;

  for (let h = 0; h <= Math.min(hours, 48); h += 2) {
    // Simulate temperature fluctuation (±3°C sine wave over 24h cycle)
    const tempVariation = Math.sin((h / 24) * Math.PI * 2) * 3;
    const temp = Math.round((baseTemp + tempVariation) * 10) / 10;

    const tempExcess = Math.max(0, temp - IDEAL_TEMP);
    const degradationMultiplier = 1 + tempExcess * DEGRADATION_FACTOR;
    const hourlyDegradation = degradationMultiplier * 2; // per 2-hour step
    remaining = Math.max(0, remaining - hourlyDegradation);

    data.push({ hour: h, temp, remaining: Math.round(remaining * 10) / 10 });

    if (remaining <= 0) break;
  }

  return data;
}

export function getUrgencyLevel(hoursRemaining: number): "fresh" | "warning" | "danger" {
  if (hoursRemaining > 12) return "fresh";
  if (hoursRemaining >= 6) return "warning";
  return "danger";
}

export function getFoodEmoji(foodName: string): string {
  const name = foodName.toLowerCase();
  if (name.includes("rice")) return "🍚";
  if (name.includes("bread")) return "🍞";
  if (name.includes("fruit") || name.includes("apple") || name.includes("banana")) return "🍎";
  if (name.includes("vegetable") || name.includes("salad")) return "🥗";
  if (name.includes("milk") || name.includes("dairy")) return "🥛";
  if (name.includes("meat") || name.includes("chicken")) return "🍗";
  if (name.includes("fish") || name.includes("seafood")) return "🐟";
  if (name.includes("soup") || name.includes("stew")) return "🍲";
  if (name.includes("cake") || name.includes("pastry") || name.includes("dessert")) return "🍰";
  if (name.includes("pizza")) return "🍕";
  if (name.includes("sandwich") || name.includes("burger")) return "🍔";
  if (name.includes("curry")) return "🍛";
  if (name.includes("noodle") || name.includes("pasta")) return "🍝";
  return "🍱";
}

// Simulate weather API (returns realistic temperature for Indian cities)
export function fetchTemperature(city: string): number {
  const cityTemps: Record<string, number> = {
    mumbai: 30, delhi: 28, bangalore: 25, chennai: 32, kolkata: 29,
    hyderabad: 31, pune: 27, ahmedabad: 33, jaipur: 30, lucknow: 28,
  };
  const base = cityTemps[city.toLowerCase()] ?? 28;
  // Add small random variation
  return Math.round((base + (Math.random() - 0.5) * 4) * 10) / 10;
}
