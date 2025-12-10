export type MqttAction = 'subscribe' | 'publish';

export interface DeviceStatus {
  online: boolean;
  auto_mode: boolean;
  ip: string;
  rssi: number | null;
  distance: number | null;
  threshold: number | null;
  servo: number | null;
}

export interface ControlPayload {
  servo: string | number | null;
  threshold: number | null;
}

export interface RfidPayload {
  uid?: string;
  [key: string]: unknown;
}

export interface MqttLogEntry {
  time: string;
  action: MqttAction;
  message: string;
  topic: string;
}

export interface MqttContextValue {
  isConnected: boolean;
  status: string;
  sendMessage: (topic: string, payload: string) => boolean;
  reconnect: () => void;
  disconnect: () => void;
  deviceStatus: DeviceStatus;
  lastStatusReceived: number;
  mqttLogs: MqttLogEntry[];
  rfidPayload: RfidPayload | null;
  controlPayload: ControlPayload;
}
