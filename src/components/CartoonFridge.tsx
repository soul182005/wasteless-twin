import { FoodItem } from "@/lib/foodStore";
import { getUrgencyLevel, getFoodEmoji } from "@/lib/digitalTwin";
import { getRemainingHours } from "@/lib/foodStore";

interface CartoonFridgeProps {
  foods: FoodItem[];
}

export default function CartoonFridge({ foods }: CartoonFridgeProps) {
  const activeItems = foods.filter((f) => f.status !== "picked_up");

  const urgencyClass = (item: FoodItem) => {
    const level = getUrgencyLevel(getRemainingHours(item));
    return level === "fresh"
      ? "urgency-fresh-border bg-green-50"
      : level === "warning"
      ? "urgency-warning-border bg-yellow-50"
      : "urgency-danger-border bg-red-50 animate-pulse-urgent";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Fridge top / freezer */}
      <div className="w-72 h-8 bg-fridge-body rounded-t-2xl border-2 border-fridge-shelf flex items-center justify-center">
        <div className="w-10 h-2 rounded-full bg-fridge-shelf" />
      </div>

      {/* Fridge body */}
      <div className="w-72 min-h-[360px] bg-fridge-inner border-x-4 border-b-4 border-fridge-body rounded-b-2xl relative p-3 flex flex-col gap-1">
        {/* Shelves with items */}
        {[0, 1, 2].map((shelf) => {
          const shelfItems = activeItems.filter((_, i) => i % 3 === shelf);
          return (
            <div key={shelf} className="flex-1">
              <div className="flex flex-wrap gap-1.5 py-1.5 px-1">
                {shelfItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-2 rounded-lg px-2 py-1 text-xs font-body max-w-[120px] truncate ${urgencyClass(item)}`}
                    title={`${item.food_name} — ${Math.round(getRemainingHours(item))}h left`}
                  >
                    <span className="text-base mr-1">{getFoodEmoji(item.food_name)}</span>
                    <span className="text-foreground font-medium">{item.food_name}</span>
                  </div>
                ))}
              </div>
              {shelf < 2 && <div className="h-0.5 bg-fridge-shelf rounded-full mx-2" />}
            </div>
          );
        })}

        {activeItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic">
            Fridge is empty — add food items!
          </div>
        )}

        {/* Handle */}
        <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-3 h-16 bg-fridge-shelf rounded-r-full" />
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3 text-xs font-body">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-fresh inline-block" /> &gt;12h</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning inline-block" /> 6-12h</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-danger inline-block" /> &lt;6h</span>
      </div>
    </div>
  );
}
