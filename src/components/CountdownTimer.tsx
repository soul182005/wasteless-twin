import { useEffect, useState } from "react";

interface Props {
  targetTime: string; // ISO string
}

export default function CountdownTimer({ targetTime }: Props) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return <span className="font-mono text-sm font-semibold">{timeLeft}</span>;
}
