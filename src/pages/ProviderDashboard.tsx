import { Link } from "react-router-dom";
import { useFoodContext } from "@/context/FoodContext";
import CartoonFridge from "@/components/CartoonFridge";
import AddFoodForm from "@/components/AddFoodForm";
import DigitalTwinGraph from "@/components/DigitalTwinGraph";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRemainingHours } from "@/lib/foodStore";
import { getUrgencyLevel, getFoodEmoji } from "@/lib/digitalTwin";

const ProviderDashboard = () => {
  const { foods, confirmPickup } = useFoodContext();

  const activeFoods = foods.filter((f) => f.status !== "picked_up");
  const pickupRequests = foods.filter((f) => f.status === "pickup_requested");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <Link to="/" className="font-display text-xl font-bold text-primary">🍱 Food Guardian</Link>
        <span className="text-sm text-muted-foreground font-display">Provider Dashboard</span>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Fridge */}
          <div className="flex flex-col items-center">
            <h2 className="font-display text-2xl font-bold mb-4 text-foreground">🧊 Your Fridge</h2>
            <CartoonFridge foods={activeFoods} />
          </div>

          {/* Right - Add Form */}
          <div>
            <Card className="p-6">
              <AddFoodForm />
            </Card>
          </div>
        </div>

        {/* All Active Food Cards with Graphs */}
        {activeFoods.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4 text-foreground">📊 Food Items — Expiry Tracking</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeFoods.map((item) => {
                const remaining = getRemainingHours(item);
                const urgency = getUrgencyLevel(remaining);
                const urgencyBorder = urgency === "fresh"
                  ? "urgency-fresh-border"
                  : urgency === "warning"
                  ? "urgency-warning-border"
                  : "urgency-danger-border";

                return (
                  <Card key={item.id} className={`p-4 border-2 ${urgencyBorder}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-display font-semibold text-foreground">
                        {getFoodEmoji(item.food_name)} {item.food_name}
                      </p>
                      <Badge variant={item.use_digital_twin ? "default" : "secondary"} className="text-[10px]">
                        {item.use_digital_twin ? "🧠 Digital Twin" : "📝 Manual"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.quantity} — <span className="font-semibold">{Math.round(remaining)}h left</span>
                    </p>
                    {item.use_digital_twin && (
                      <p className="text-xs text-muted-foreground mb-2">
                        🌡️ {item.current_temp}°C · Provider expiry: {item.expiry_hours}h → Digital Twin: {item.predicted_spoilage_hours}h
                      </p>
                    )}
                    <DigitalTwinGraph item={item} />
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Pickup Requests */}
        {pickupRequests.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4 text-foreground">📦 Pickup Requests</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pickupRequests.map((item) => (
                <Card key={item.id} className="p-4 border-2 urgency-warning-border">
                  <p className="font-display font-semibold">{item.food_name}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} — {Math.round(getRemainingHours(item))}h left</p>
                  <p className="text-xs text-muted-foreground mt-1">An NGO wants to pick this up!</p>
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => confirmPickup(item.id)}
                  >
                    ✅ Confirm Pickup
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
