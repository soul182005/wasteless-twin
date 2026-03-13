import { useState } from "react";
import { useFoodContext } from "@/context/FoodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AddFoodForm() {
  const { addFoodItem } = useFoodContext();
  const [useDigitalTwin, setUseDigitalTwin] = useState(true);
  const [form, setForm] = useState({
    food_name: "",
    description: "",
    city: "",
    provider_address: "",
    quantity: "",
    expiry_hours: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.food_name || !form.city || !form.expiry_hours) {
      toast.error("Please fill in food name, city, and expiry hours");
      return;
    }
    const item = addFoodItem({
      ...form,
      expiry_hours: Number(form.expiry_hours),
      use_digital_twin: useDigitalTwin,
    });
    const activeHours = useDigitalTwin ? item.predicted_spoilage_hours : item.expiry_hours;
    toast.success(`Added "${item.food_name}" — ${useDigitalTwin ? `AI predicted ${item.predicted_spoilage_hours}h shelf life at ${item.current_temp}°C` : `using your ${item.expiry_hours}h expiry`}`);
    setForm({ food_name: "", description: "", city: "", provider_address: "", quantity: "", expiry_hours: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">➕ Add Food Item</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="food_name">Food Name *</Label>
          <Input name="food_name" value={form.food_name} onChange={handleChange} placeholder="Cooked Rice" />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input name="quantity" value={form.quantity} onChange={handleChange} placeholder="5kg" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Leftover from lunch, still fresh" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
        </div>
        <div>
          <Label htmlFor="expiry_hours">Expiry Hours *</Label>
          <Input name="expiry_hours" type="number" value={form.expiry_hours} onChange={handleChange} placeholder="48" />
        </div>
      </div>
      <div>
        <Label htmlFor="provider_address">Address</Label>
        <Input name="provider_address" value={form.provider_address} onChange={handleChange} placeholder="12 MG Road, Andheri" />
      </div>

      {/* Digital Twin Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/30">
        <div className="space-y-0.5">
          <Label htmlFor="digital-twin-toggle" className="text-sm font-semibold cursor-pointer">
            🧠 Use AI Spoilage Prediction
          </Label>
          <p className="text-xs text-muted-foreground">
            {useDigitalTwin
              ? "Digital Twin will adjust expiry based on temperature & conditions"
              : "Using your manually entered expiry time as-is"}
          </p>
        </div>
        <Switch
          id="digital-twin-toggle"
          checked={useDigitalTwin}
          onCheckedChange={setUseDigitalTwin}
        />
      </div>

      <Button type="submit" className="w-full">Add to Fridge</Button>
    </form>
  );
}
  const { addFoodItem } = useFoodContext();
  const [form, setForm] = useState({
    food_name: "",
    description: "",
    city: "",
    provider_address: "",
    quantity: "",
    expiry_hours: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.food_name || !form.city || !form.expiry_hours) {
      toast.error("Please fill in food name, city, and expiry hours");
      return;
    }
    const item = addFoodItem({
      ...form,
      expiry_hours: Number(form.expiry_hours),
    });
    toast.success(`Added "${item.food_name}" — predicted ${item.predicted_spoilage_hours}h shelf life at ${item.current_temp}°C`);
    setForm({ food_name: "", description: "", city: "", provider_address: "", quantity: "", expiry_hours: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">➕ Add Food Item</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="food_name">Food Name *</Label>
          <Input name="food_name" value={form.food_name} onChange={handleChange} placeholder="Cooked Rice" />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input name="quantity" value={form.quantity} onChange={handleChange} placeholder="5kg" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Leftover from lunch, still fresh" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
        </div>
        <div>
          <Label htmlFor="expiry_hours">Expiry Hours *</Label>
          <Input name="expiry_hours" type="number" value={form.expiry_hours} onChange={handleChange} placeholder="48" />
        </div>
      </div>
      <div>
        <Label htmlFor="provider_address">Address</Label>
        <Input name="provider_address" value={form.provider_address} onChange={handleChange} placeholder="12 MG Road, Andheri" />
      </div>
      <Button type="submit" className="w-full">Add to Fridge</Button>
    </form>
  );
}
