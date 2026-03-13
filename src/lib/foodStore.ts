// Food data store using localStorage

export interface FoodItem {
  id: string;
  food_name: string;
  description: string;
  city: string;
  provider_address: string;
  quantity: string;
  expiry_hours: number;
  current_temp: number;
  predicted_spoilage_hours: number;
  predicted_spoilage_time: string;
  use_digital_twin: boolean;
  status: "available" | "pickup_requested" | "picked_up";
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "food_waste_items";

function getItems(): FoodItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveItems(items: FoodItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAllFoods(): FoodItem[] {
  return getItems();
}

export function getAvailableFoods(): FoodItem[] {
  return getItems().filter((f) => f.status !== "picked_up");
}

export function addFood(item: Omit<FoodItem, "id" | "created_at" | "updated_at">): FoodItem {
  const items = getItems();
  const newItem: FoodItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  items.push(newItem);
  saveItems(items);
  return newItem;
}

export function updateFoodStatus(id: string, status: FoodItem["status"]): FoodItem | null {
  const items = getItems();
  const idx = items.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  items[idx].status = status;
  items[idx].updated_at = new Date().toISOString();
  saveItems(items);
  return items[idx];
}

export function getRemainingHours(item: FoodItem): number {
  const createdAt = new Date(item.created_at).getTime();
  const now = Date.now();
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
  const totalHours = item.use_digital_twin ? item.predicted_spoilage_hours : item.expiry_hours;
  return Math.max(0, totalHours - elapsedHours);
}

export function getExpiryTime(item: FoodItem): string {
  const totalHours = item.use_digital_twin ? item.predicted_spoilage_hours : item.expiry_hours;
  return new Date(new Date(item.created_at).getTime() + totalHours * 60 * 60 * 1000).toISOString();
}
