import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl animate-float">
        <div className="text-7xl mb-4">🍱</div>
        <h1 className="font-display text-5xl font-bold text-foreground mb-3">
          Food Waste <span className="text-primary">Guardian</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Digital Twin-powered Food Waste Management &amp; Alert System
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          Predict spoilage · Alert NGOs · Save food · Feed communities
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/provider" className="flex-1">
          <Button size="lg" className="w-full text-base h-14 font-display">
            🏪 I'm a Food Provider
          </Button>
        </Link>
        <Link to="/ngo" className="flex-1">
          <Button size="lg" variant="outline" className="w-full text-base h-14 font-display border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            🤝 I'm an NGO
          </Button>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-lg">
        <div>
          <div className="text-3xl mb-1">🌡️</div>
          <p className="text-xs text-muted-foreground">Real-time Temperature</p>
        </div>
        <div>
          <div className="text-3xl mb-1">🧊</div>
          <p className="text-xs text-muted-foreground">Digital Twin Simulation</p>
        </div>
        <div>
          <div className="text-3xl mb-1">⏰</div>
          <p className="text-xs text-muted-foreground">Smart Spoilage Alerts</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
