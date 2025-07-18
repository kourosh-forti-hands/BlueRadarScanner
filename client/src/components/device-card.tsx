import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignalStrength } from "./signal-strength";
import { BluetoothDevice } from "@/hooks/use-bluetooth";
import { Bluetooth, Copy, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeviceCardProps {
  device: BluetoothDevice;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `MAC address ${text} copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy MAC address to clipboard",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    const timeSinceLastSeen = Date.now() - device.lastSeen.getTime();
    
    if (timeSinceLastSeen < 5000) {
      return <Badge className="bg-signal-green/10 text-signal-green hover:bg-signal-green/20">Connected</Badge>;
    } else if (timeSinceLastSeen < 30000) {
      return <Badge className="bg-alert-orange/10 text-alert-orange hover:bg-alert-orange/20">Scanning</Badge>;
    } else {
      return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  const formatLastSeen = () => {
    const timeSinceLastSeen = Date.now() - device.lastSeen.getTime();
    const seconds = Math.floor(timeSinceLastSeen / 1000);
    
    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ago`;
    } else {
      return `${Math.floor(seconds / 3600)}h ago`;
    }
  };

  const formatTimestamp = () => {
    return device.lastSeen.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-tech-blue/10 rounded-lg flex items-center justify-center">
              <Bluetooth className="text-tech-blue text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark">
                {device.name}
              </h3>
              <p className="text-sm text-gray-500">{device.deviceType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">MAC Address</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(device.macAddress)}
              >
                <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </Button>
            </div>
            <div className="font-mono text-lg font-semibold text-dark">
              {device.macAddress}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Signal Strength
            </div>
            <SignalStrength rssi={device.rssi} />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Last Seen
            </div>
            <div className="text-lg font-semibold text-dark">
              {formatLastSeen()}
            </div>
            <div className="text-sm text-gray-500">
              {formatTimestamp()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
