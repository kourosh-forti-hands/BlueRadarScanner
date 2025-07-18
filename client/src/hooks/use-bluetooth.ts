import { useState, useCallback, useRef } from "react";

export interface BluetoothDevice {
  id: string;
  name: string;
  macAddress: string;
  rssi: number;
  lastSeen: Date;
  deviceType: string;
  isTargetDevice: boolean;
}

export function useBluetoothScanner() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [scanStartTime, setScanStartTime] = useState<Date | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkBluetoothSupport = useCallback(() => {
    if (!navigator.bluetooth) {
      setError("Web Bluetooth API is not supported in this browser");
      setIsSupported(false);
      return false;
    }
    setIsSupported(true);
    return true;
  }, []);

  const isTargetDevice = useCallback((macAddress: string) => {
    return macAddress.toUpperCase().startsWith('00:25:DF');
  }, []);

  const generateMockDevice = useCallback((index: number): BluetoothDevice => {
    const mockDevices = [
      { name: 'Temperature Sensor Pro', mac: '00:25:DF:A3:B7:C9', type: 'Environmental Monitor' },
      { name: 'Smart Lock Gateway', mac: '00:25:DF:F1:E2:D3', type: 'Access Control' },
      { name: 'Beacon Module v2', mac: '00:25:DF:88:99:AA', type: 'Location Beacon' },
      { name: 'Humidity Sensor', mac: '00:25:DF:12:34:56', type: 'Environmental Monitor' },
      { name: 'Motion Detector', mac: '00:25:DF:AB:CD:EF', type: 'Security Device' },
    ];
    
    const device = mockDevices[index % mockDevices.length];
    return {
      id: `${device.mac}-${Date.now()}`,
      name: device.name,
      macAddress: device.mac,
      rssi: Math.floor(Math.random() * 50) - 90, // Random RSSI between -90 and -40
      lastSeen: new Date(),
      deviceType: device.type,
      isTargetDevice: isTargetDevice(device.mac),
    };
  }, [isTargetDevice]);

  const startScan = useCallback(async () => {
    if (!checkBluetoothSupport()) {
      return;
    }

    try {
      setError(null);
      setIsScanning(true);
      setScanStartTime(new Date());
      setDevices([]);

      // Note: Web Bluetooth API doesn't support passive scanning for all devices
      // This is a limitation of the Web Bluetooth API for security reasons
      // In a real implementation, you would use navigator.bluetooth.requestLEScan()
      // but this requires specific permissions and may not work in all browsers
      
      // For demonstration purposes, we'll simulate device discovery
      // In a real app, you would need to use Web Bluetooth API's requestDevice
      // or requestLEScan methods with proper permissions

      let deviceCount = 0;
      scanIntervalRef.current = setInterval(() => {
        if (deviceCount < 5) {
          const newDevice = generateMockDevice(deviceCount);
          setDevices(prev => {
            // Avoid duplicates
            const exists = prev.find(d => d.macAddress === newDevice.macAddress);
            if (!exists) {
              return [...prev, newDevice];
            }
            return prev;
          });
          deviceCount++;
        }
      }, 2000);

      // Note: In a real implementation, you would do:
      // const scan = await navigator.bluetooth.requestLEScan({
      //   filters: [{ manufacturerData: { 0x0025: { dataPrefix: new Uint8Array([0xDF]) } } }],
      //   keepRepeatedDevices: true,
      // });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start BLE scan');
      setIsScanning(false);
    }
  }, [checkBluetoothSupport, generateMockDevice]);

  const stopScan = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
    setScanStartTime(null);
  }, []);

  const clearDevices = useCallback(() => {
    setDevices([]);
  }, []);

  const getScanDuration = useCallback(() => {
    if (!scanStartTime) return 0;
    return Math.floor((Date.now() - scanStartTime.getTime()) / 1000);
  }, [scanStartTime]);

  const getTargetDeviceCount = useCallback(() => {
    return devices.filter(d => d.isTargetDevice).length;
  }, [devices]);

  return {
    devices,
    isScanning,
    error,
    isSupported,
    scanStartTime,
    startScan,
    stopScan,
    clearDevices,
    getScanDuration,
    getTargetDeviceCount,
    targetDevices: devices.filter(d => d.isTargetDevice),
  };
}
