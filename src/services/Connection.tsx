import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Client, Message } from "paho-mqtt";
import type { ConnectionOptions } from "paho-mqtt";
import { message as antdMessage } from "antd";
import CONFIG from "./Config";
import { MQTTContext } from "./MqttContext";
import { userService, accessLogsApi } from "./api";
import type { ControlPayload, DeviceStatus, MqttLogEntry, RfidPayload } from "../domain/mqtt";
import type { FileUploadHandle, WebcamHandle } from "../domain/controls";

type AccessProcessResult = {
  data?: {
    access?: boolean;
    [key: string]: unknown;
  };
  access?: boolean;
  message?: string;
};

interface MQTTProviderProps {
  children: ReactNode;
  webcamRef?: RefObject<WebcamHandle | null>;
  fileUploadRef?: RefObject<FileUploadHandle | null>;
}

export const MQTTProvider = ({ children, webcamRef }: MQTTProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [lastStatusReceived, setLastStatusReceived] = useState(Date.now());
  const clientRef = useRef<Client | null>(null);
  const connectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const heartbeatTimeout = 30000;
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    online: false,
    auto_mode: true,
    ip: "",
    rssi: null,
    distance: null,
    threshold: null,
    servo: null,
  });
  const [controlPayload] = useState<ControlPayload>({
    servo: null,
    threshold: null,
  });
  const [mqttLogs, setMqttLogs] = useState<MqttLogEntry[]>([]);
  const [rfidPayload, setRfidPayload] = useState<RfidPayload | null>(null);
  const subscribedTopics = useRef<Set<string>>(new Set());

  const connect = () => {
    connectAttemptsRef.current += 1;
    setStatus("Connecting...");
    const uniqueClientId = `mqtt_client_${Math.random().toString(16).substr(2, 8)}_${Date.now()}`;

    const client = new Client(
      CONFIG.broker.host,
      CONFIG.broker.port,
      CONFIG.broker.path,
      uniqueClientId
    );
    clientRef.current = client;

    client.onConnectionLost = (responseObject: { errorCode: number; errorMessage?: string }) => {
      if (responseObject.errorCode !== 0) {
        console.log("Connection lost: " + responseObject.errorMessage);
        antdMessage.error("Connection lost: " + responseObject.errorMessage);
        setIsConnected(false);
        setStatus("Disconnected");
        attemptReconnect();
      }
    };

    client.onMessageArrived = (message) => {
      const topic = message.destinationName;
      const payload = message.payloadString;
      const now = new Date().toLocaleString();

      console.log("Message arrived: ", topic, payload);

      if (topic === CONFIG.topics.statusTopic) {
        try {
          const parsedPayload = JSON.parse(payload) as Partial<DeviceStatus>;
          setDeviceStatus((prev) => ({
            ...prev,
            ...parsedPayload,
            online: parsedPayload.online ?? prev.online,
          }));
          setLastStatusReceived(Date.now());
        } catch (error) {
          console.error("Failed to parse device status:", error);
        }
      }

      if (topic === CONFIG.topics.rfidTopic) {
        try {
          const parsedPayload = JSON.parse(payload) as RfidPayload;
          setRfidPayload(parsedPayload);
          setLastStatusReceived(Date.now());

          if (parsedPayload.pid) {
            void processRFIDAccess(parsedPayload.pid);
          }
        } catch (error) {
          console.error("Failed to parse RFID payload:", error);
        }
      }

      const logEntry: MqttLogEntry = {
        time: now,
        action: "subscribe",
        message: payload,
        topic,
      };
      setMqttLogs((prev) => [logEntry, ...prev.slice(0, 99)]);
    };

    const connectOptions: ConnectionOptions & { reconnect?: boolean } = {
      useSSL: CONFIG.broker.useSSL,
      keepAliveInterval: 30,
      cleanSession: true,
      reconnect: true,
      timeout: 10,
      userName: CONFIG.broker.username,
      password: CONFIG.broker.password,
      onSuccess: () => {
        connectAttemptsRef.current = 0;
        setIsConnected(true);
        setStatus("Connected");
        antdMessage.success("Connected to MQTT broker");

        Object.values(CONFIG.topics).forEach((topic) => {
          if (!subscribedTopics.current.has(topic)) {
            try {
              client.subscribe(topic, { qos: 0 });
              subscribedTopics.current.add(topic);
              console.log(`Subscribed to ${topic}`);
            } catch (error) {
              console.error(`Failed to subscribe to ${topic}:`, error);
            }
          }
        });
      },
      onFailure: (err: { errorMessage?: string }) => {
        console.error("Connection failed:", err);
        setIsConnected(false);
        setStatus(`Failed: ${err.errorMessage || 'Unknown error'}`);
        antdMessage.error(`Failed to connect: ${err.errorMessage || 'Unknown error'}`);
        attemptReconnect();
      },
    };

    try {
      client.connect(connectOptions);
    } catch (error) {
      console.error("Exception during connect:", error);
      setStatus("Error connecting");
      attemptReconnect();
    }
  };

  const attemptReconnect = () => {
    if (connectAttemptsRef.current < maxReconnectAttempts) {
      const delay = Math.min(3000 * (connectAttemptsRef.current), 15000);
      setStatus(`Reconnecting in ${delay / 1000}s (attempt ${connectAttemptsRef.current}/${maxReconnectAttempts})...`);

      setTimeout(() => {
        connect();
      }, delay);
    } else {
      setStatus(`Failed after ${maxReconnectAttempts} attempts. Please try again later.`);
      antdMessage.error(`Connection failed after ${maxReconnectAttempts} attempts. Please try again later.`);
    }
  };

  const sendMessage = (topic: string, payload: string) => {
    if (clientRef.current && clientRef.current.isConnected()) {
      try {
        const mqttMessage = new Message(payload);
        mqttMessage.destinationName = topic;
        mqttMessage.qos = 1;
        clientRef.current.send(mqttMessage);

        setMqttLogs((prev) => [
          {
            time: new Date().toLocaleString(),
            action: "publish",
            message: payload,
            topic,
          },
          ...prev.slice(0, 99),
        ]);

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        antdMessage.error("Failed to send message");
        return false;
      }
    } else {
      antdMessage.warning("Client is not connected");
      return false;
    }
  };

  const disconnect = () => {
    if (clientRef.current && isConnected) {
      try {
        clientRef.current.disconnect();
        setIsConnected(false);
        setStatus("Disconnected");
        antdMessage.info("Disconnected from broker");
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  };

  const reconnect = () => {
    disconnect();
    connectAttemptsRef.current = 0;
  };

  const processRFIDAccess = async (pid: string): Promise<AccessProcessResult | null> => {
    try {
      const imageFile = webcamRef?.current?.captureImage?.();

      const accessResult = await accessLogsApi.processRFIDAccess(pid, imageFile);
      console.log("Access result:", accessResult);

      const user = await userService.getUserByUid(pid);
      console.log("User found:", user);

      if (accessResult?.data?.access === true) {
        const name = user ? user.name : pid;
        antdMessage.success(`Access granted for ${name}`);

        const gateOpenPayload = JSON.stringify({ 
          ...controlPayload,
          servo: "1" 
        });
        sendMessage(CONFIG.topicPub.controlTopic, gateOpenPayload);
      } else {
        const name = user ? user.name : pid;
        antdMessage.error(`Access denied for ${name}: ${accessResult.message}`);
      }

      return accessResult;
    } catch (error) {
      console.error("Error processing RFID access:", error);
      antdMessage.error("Error processing RFID access");

      try {
        const errorResult = await accessLogsApi.processRFIDAccess(pid);
        return errorResult;
      } catch (logError) {
        console.error("Error logging access attempt:", logError);
        return null;
      }
    }
  };

  useEffect(() => {
    connect();

    const heartbeatChecker = window.setInterval(() => {
      const now = Date.now();
      if (now - lastStatusReceived > heartbeatTimeout) {
        // device dianggap offline
        setDeviceStatus((prev) => ({
          ...prev,
          online: false
        }));
      }
    }, 10000);

    return () => {
      disconnect();
      window.clearInterval(heartbeatChecker);
    };
  }, []);

  return (
    <MQTTContext.Provider
      value={{
        isConnected,
        status,
        sendMessage,
        reconnect,
        disconnect,
        deviceStatus,
        lastStatusReceived,
        mqttLogs,
        rfidPayload,
        controlPayload,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};
