import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { simulateFutureTemps } from "@/lib/digitalTwin";
import { FoodItem, getRemainingHours } from "@/lib/foodStore";

interface Props {
  item: FoodItem;
}

export default function DigitalTwinGraph({ item }: Props) {
  const remaining = getRemainingHours(item);
  const data = simulateFutureTemps(item.current_temp, remaining);

  return (
    <div className="w-full">
      <h4 className="text-xs font-display font-semibold text-muted-foreground mb-1">
        🧊 Digital Twin — Spoilage Simulation
      </h4>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 15% 85%)" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} label={{ value: "Hours", position: "insideBottomRight", offset: -5, fontSize: 10 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: "°C", angle: -90, position: "insideLeft", fontSize: 10 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: "Hours left", angle: 90, position: "insideRight", fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line yAxisId="left" type="monotone" dataKey="temp" stroke="hsl(200 80% 55%)" name="Temperature (°C)" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="remaining" stroke="hsl(0 72% 51%)" name="Shelf Life (hrs)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
