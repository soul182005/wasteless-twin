import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { FoodItem, getAllFoods, addFood, updateFoodStatus, getRemainingHours } from "@/lib/foodStore";
import { fetchTemperature, predictSpoilage } from "@/lib/digitalTwin";

interface FoodContextType {
  foods: FoodItem[];
  refresh: () => void;
  addFoodItem: (data: {
    food_name: string;
    description: string;
    city: string;
    provider_address: string;
    quantity: string;
    expiry_hours: number;
    use_digital_twin: boolean;
  }) => FoodItem;
  requestPickup: (id: string) => void;
  confirmPickup: (id: string) => void;
  getRemainingHrs: (item: FoodItem) => number;
}

const FoodContext = createContext<FoodContextType | null>(null);

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const refresh = useCallback(() => {
    setFoods(getAllFoods());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000); // refresh every 5s for countdown
    return () => clearInterval(interval);
  }, [refresh]);

  const addFoodItem = useCallback(
    (data: {
      food_name: string;
      description: string;
      city: string;
      provider_address: string;
      quantity: string;
      expiry_hours: number;
      use_digital_twin: boolean;
    }) => {
      const temp = fetchTemperature(data.city);
      const spoilageHours = predictSpoilage(temp, data.expiry_hours);
      const spoilageTime = new Date(Date.now() + spoilageHours * 60 * 60 * 1000).toISOString();

      const item = addFood({
        ...data,
        current_temp: temp,
        predicted_spoilage_hours: spoilageHours,
        predicted_spoilage_time: spoilageTime,
        status: "available",
      });
      refresh();
      return item;
    },
    [refresh]
  );

  const requestPickup = useCallback(
    (id: string) => {
      updateFoodStatus(id, "pickup_requested");
      refresh();
    },
    [refresh]
  );

  const confirmPickup = useCallback(
    (id: string) => {
      updateFoodStatus(id, "picked_up");
      refresh();
    },
    [refresh]
  );

  return (
    <FoodContext.Provider value={{ foods, refresh, addFoodItem, requestPickup, confirmPickup, getRemainingHrs: getRemainingHours }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFoodContext() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error("useFoodContext must be used within FoodProvider");
  return ctx;
}
