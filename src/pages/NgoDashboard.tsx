import { Link } from "react-router-dom";
import { useFoodContext } from "@/context/FoodContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "@/components/CountdownTimer";
import DigitalTwinGraph from "@/components/DigitalTwinGraph";
import { getUrgencyLevel, getFoodEmoji } from "@/lib/digitalTwin";
import { getRemainingHours, getExpiryTime } from "@/lib/foodStore";

const NgoDashboard = () => {
  const { foods, requestPickup } = useFoodContext();

  const availableFoods = foods.filter((f) => f.status === "available");
  const requestedFoods = foods.filter((f) => f.status === "pickup_requested");

  const urgencyBadge = (level: "fresh" | "warning" | "danger") => {
    if (level === "fresh") return <Badge className="urgency-fresh">Fresh</Badge>;
    if (level === "warning") return <Badge className="urgency-warning">Urgent</Badge>;
    return <Badge className="urgency-danger animate-pulse-urgent">Critical!</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <Link to="/" className="font-display text-xl font-bold text-primary">🍱 Wasteless Twin</Link>
        <span className="text-sm text-muted-foreground font-display">NGO Dashboard</span>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">🚨 Available Food Items</h2>

        {availableFoods.length === 0 && requestedFoods.length === 0 && (
          <Card className="p-10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-muted-foreground font-display">No food items available right now. Check back soon!</p>
          </Card>
        )}

        <div className="space-y-4">
          {availableFoods.map((item) => {
            const remaining = getRemainingHours(item);
            const level = getUrgencyLevel(remaining);
            const borderClass = level === "fresh" ? "urgency-fresh-border" : level === "warning" ? "urgency-warning-border" : "urgency-danger-border";

            return (
              <Card key={item.id} className={`p-5 border-2 ${borderClass}`}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getFoodEmoji(item.food_name)}</span>
                      <h3 className="font-display text-lg font-bold text-foreground">{item.food_name}</h3>
                      {urgencyBadge(level)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                      <p><span className="text-muted-foreground">📍</span> {item.provider_address || item.city}</p>
                      <p><span className="text-muted-foreground">📦</span> {item.quantity}</p>
                      <p><span className="text-muted-foreground">🌡️</span> {item.current_temp}°C</p>
                      <p>
                        <span className="text-muted-foreground">⏱️</span>{" "}
                        <CountdownTimer targetTime={getExpiryTime(item)} />
                        <span className="ml-1 text-xs text-muted-foreground">
                          {item.use_digital_twin ? "🧠 Digital Twin" : "📝 Manual"}
                        </span>
                      </p>
                    </div>

                    <Button
                      className="mt-4"
                      onClick={() => requestPickup(item.id)}
                    >
                      🚗 I'm Coming to Pick Up
                    </Button>
                  </div>

                  <div className="md:w-80">
                    <DigitalTwinGraph item={item} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {requestedFoods.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-lg font-semibold mb-3 text-foreground">⏳ Awaiting Provider Confirmation</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {requestedFoods.map((item) => (
                <Card key={item.id} className="p-4 opacity-75">
                  <p className="font-display font-semibold">{getFoodEmoji(item.food_name)} {item.food_name}</p>
                  <p className="text-sm text-muted-foreground">Pickup requested — waiting for provider to confirm</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoDashboard;
