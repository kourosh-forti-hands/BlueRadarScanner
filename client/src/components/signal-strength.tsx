import { cn } from "@/lib/utils";

interface SignalStrengthProps {
  rssi: number;
  className?: string;
}

export function SignalStrength({ rssi, className }: SignalStrengthProps) {
  // Convert RSSI to signal strength bars (1-5)
  const getSignalBars = (rssi: number) => {
    if (rssi >= -50) return 5;
    if (rssi >= -60) return 4;
    if (rssi >= -70) return 3;
    if (rssi >= -80) return 2;
    return 1;
  };

  const bars = getSignalBars(rssi);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-2 h-6 rounded-sm transition-colors",
              bar <= bars 
                ? "bg-signal-green" 
                : "bg-gray-300"
            )}
            style={{ height: `${4 + bar * 4}px` }}
          />
        ))}
      </div>
      <span className="font-mono text-sm font-medium">
        {rssi} dBm
      </span>
    </div>
  );
}
