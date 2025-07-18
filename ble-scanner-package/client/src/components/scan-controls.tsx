import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Play, Square, Volume2, Wifi } from "lucide-react";
import { useBluetoothScanner } from "@/hooks/use-bluetooth";
import { useAudioNotifications } from "@/hooks/use-audio";

interface ScanControlsProps {
  onDeviceFound?: (device: any) => void;
}

export function ScanControls({ onDeviceFound }: ScanControlsProps) {
  const {
    devices,
    isScanning,
    error,
    isSupported,
    demoMode,
    startScan,
    stopScan,
    getScanDuration,
    getTargetDeviceCount,
    targetDevices,
  } = useBluetoothScanner();

  const {
    isEnabled: audioEnabled,
    playNotificationSound,
    toggle: toggleAudio,
  } = useAudioNotifications();

  const [scanDuration, setScanDuration] = useState(0);
  const [prevTargetCount, setPrevTargetCount] = useState(0);

  // Update scan duration every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanDuration(getScanDuration());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning, getScanDuration]);

  // Play notification sound when new target device is found
  useEffect(() => {
    const currentTargetCount = getTargetDeviceCount();
    if (currentTargetCount > prevTargetCount) {
      playNotificationSound();
      if (onDeviceFound && targetDevices.length > 0) {
        onDeviceFound(targetDevices[targetDevices.length - 1]);
      }
    }
    setPrevTargetCount(currentTargetCount);
  }, [getTargetDeviceCount, playNotificationSound, onDeviceFound, targetDevices, prevTargetCount]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScanStatus = () => {
    if (!isSupported && demoMode) return "Demo mode - simulated scanning";
    if (!isSupported) return "Web Bluetooth not supported";
    if (error) return `Error: ${error}`;
    if (isScanning) return "Scanning for devices...";
    return "Ready to scan";
  };

  const getProgressPercentage = () => {
    if (!isScanning) return 0;
    // Simulate progress based on scan duration (max 60 seconds)
    return Math.min((scanDuration / 60) * 100, 100);
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${isScanning ? 'bg-tech-blue animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-lg font-medium">{getScanStatus()}</span>
            </div>
            <div className="text-sm text-gray-500">
              Target: <span className="font-mono font-medium">00:25:DF:xx:xx:xx</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Audio Toggle */}
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <Switch
                checked={audioEnabled}
                onCheckedChange={toggleAudio}
                className="data-[state=checked]:bg-tech-blue"
              />
            </div>

            {/* API Support Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-signal-green' : 'bg-error-red'}`} />
              <span className="text-sm text-gray-600">
                {isSupported ? 'API Ready' : 'API Not Supported'}
              </span>
            </div>

            {/* Scan Controls */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => startScan(onDeviceFound)}
                disabled={isScanning}
                className="bg-tech-blue hover:bg-blue-600 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                {!isSupported ? "Start Demo" : "Start Scan"}
              </Button>
              <Button
                onClick={stopScan}
                disabled={!isScanning}
                variant="outline"
                className="hover:bg-gray-100"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </div>

        {/* Scan Progress */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Scan Progress</span>
            <span className="text-sm text-gray-500">{formatDuration(scanDuration)}</span>
          </div>
          <Progress value={getProgressPercentage()} className="mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{devices.length} devices found</span>
            <span>{getTargetDeviceCount()} target devices</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-error-red/10 border border-error-red/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error-red rounded-full" />
              <span className="text-sm font-medium text-error-red">Error: {error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
