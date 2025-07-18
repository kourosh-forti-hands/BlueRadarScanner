import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceCard } from "@/components/device-card";
import { ScanControls } from "@/components/scan-controls";
import { BrowserSupportInfo } from "@/components/browser-support-info";
import { useBluetoothScanner } from "@/hooks/use-bluetooth";
import { Search, Bluetooth, Wifi, Clock, CheckCircle, Filter } from "lucide-react";

export default function BleScanner() {
  const { devices, isScanning, isSupported, targetDevices } = useBluetoothScanner();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (devices.length > 0) {
      setLastUpdate(new Date());
    }
  }, [devices]);

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-bg-grey">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tech-blue rounded-lg flex items-center justify-center">
                <Bluetooth className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-dark">BLE Scanner</h1>
                <p className="text-sm text-gray-500">00:25:DF Device Detector</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scan Controls */}
        <div className="mb-8">
          <ScanControls />
        </div>

        {/* Device List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-dark">Discovered Devices</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Showing 00:25:DF devices only</span>
            </div>
          </div>

          {/* Target Devices */}
          {targetDevices.length > 0 ? (
            <div className="space-y-4">
              {targetDevices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="text-center py-12">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">
                  No 00:25:DF devices found
                </h3>
                <p className="text-gray-500 mb-4">
                  Start scanning to discover BLE devices with the target MAC prefix
                </p>
                {!isScanning && (
                  <Button className="bg-tech-blue hover:bg-blue-600 text-white">
                    Start Scanning
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Browser Support Information */}
        <BrowserSupportInfo />
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-tech-blue" />
              <span>Web Bluetooth API</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span>Filter: 00:25:DF</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Last update: {formatLastUpdate()}</span>
            </div>
            <div className="flex items-center space-x-2 text-signal-green">
              <CheckCircle className="h-4 w-4" />
              <span>{targetDevices.length} devices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
