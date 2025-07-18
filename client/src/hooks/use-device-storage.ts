import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { BleDevice, InsertBleDevice } from "@shared/schema";

export function useDeviceStorage() {
  const queryClient = useQueryClient();

  // Get all devices
  const {
    data: devices = [],
    isLoading,
    error,
  } = useQuery<BleDevice[]>({
    queryKey: ["/api/ble-devices"],
  });

  // Get target devices only
  const {
    data: targetDevices = [],
    isLoading: isLoadingTargets,
  } = useQuery<BleDevice[]>({
    queryKey: ["/api/ble-devices/target"],
  });

  // Save device mutation
  const saveDeviceMutation = useMutation({
    mutationFn: async (device: InsertBleDevice) => {
      return await apiRequest("/api/ble-devices", {
        method: "POST",
        body: device,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ble-devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ble-devices/target"] });
    },
  });

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      return await apiRequest(`/api/ble-devices/${deviceId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ble-devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ble-devices/target"] });
    },
  });

  // Save device function
  const saveDevice = async (device: InsertBleDevice) => {
    await saveDeviceMutation.mutateAsync(device);
  };

  // Delete device function
  const deleteDevice = async (deviceId: number) => {
    await deleteDeviceMutation.mutateAsync(deviceId);
  };

  return {
    devices,
    targetDevices,
    isLoading,
    isLoadingTargets,
    error,
    saveDevice,
    deleteDevice,
    isSaving: saveDeviceMutation.isPending,
    isDeleting: deleteDeviceMutation.isPending,
  };
}