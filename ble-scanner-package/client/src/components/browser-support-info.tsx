import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Chrome, Info, Shield, Wifi } from "lucide-react";

export function BrowserSupportInfo() {
  const supportedBrowsers = [
    { name: "Chrome", version: "56+", supported: true },
    { name: "Edge", version: "79+", supported: true },
    { name: "Opera", version: "43+", supported: true },
    { name: "Firefox", version: "Not supported", supported: false },
    { name: "Safari", version: "Not supported", supported: false },
  ];

  const requirements = [
    "HTTPS connection (secure context)",
    "User gesture required to start scanning",
    "Device must be in pairing mode",
    "Browser must support Web Bluetooth API",
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-tech-blue" />
          <span>Web Bluetooth API Support</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Web Bluetooth API is currently supported in Chrome, Edge, and Opera browsers with HTTPS.
            This app uses demo mode when the API is not available.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Chrome className="h-4 w-4" />
              <span>Browser Support</span>
            </h4>
            <div className="space-y-2">
              {supportedBrowsers.map((browser) => (
                <div key={browser.name} className="flex items-center justify-between">
                  <span className="text-sm">{browser.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{browser.version}</span>
                    <Badge 
                      variant={browser.supported ? "default" : "secondary"}
                      className={browser.supported ? "bg-signal-green" : ""}
                    >
                      {browser.supported ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Wifi className="h-4 w-4" />
              <span>Requirements</span>
            </h4>
            <ul className="space-y-2">
              {requirements.map((requirement, index) => (
                <li key={index} className="text-sm flex items-start space-x-2">
                  <span className="text-tech-blue mt-1">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Demo Mode</h4>
          <p className="text-sm text-gray-600">
            When Web Bluetooth API is not available, the app runs in demo mode with simulated 
            BLE devices. This allows you to test the interface and functionality without 
            actual Bluetooth hardware.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}