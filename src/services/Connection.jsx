import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, Message } from "paho-mqtt";
import { message as antdMessage } from "antd";
import CONFIG from "./Config";
import { MQTTContext } from "./MqttContext";
import { userService, accessLogsApi } from "./api.js";
import WebcamComponent from "../components/Webcam";

export const MQTTProvider = ({ children, webcamRef }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [lastStatusReceived, setLastStatusReceived] = useState(Date.now());

  const clientRef = useRef(null);
  const connectAttemptsRef = useRef(0);

  const maxReconnectAttempts = 5;
  const heartbeatTimeout = 30000;

  const [deviceStatus, setDeviceStatus] = useState({
    online: false,
    auto_mode: true,
    ip: "",
    rssi: null,
    distance: null,
    threshold: null,
    servo: null,
  });

  const [controlPayload, setControlPayload] = useState({
    servo: null,
    threshold: null,
  });

  const [mqttLogs, setMqttLogs] = useState([]);
  const [rfidPayload, setRfidPayload] = useState(null);
  const subscribedTopics = useRef(new Set());

  const [isProcessingRFID, setIsProcessingRFID] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const connect = () => {
    connectAttemptsRef.current += 1;
    setStatus("Connecting...");

    const uniqueClientId = `mqtt_client_${Math.random()
      .toString(16)
      .substr(2, 8)}_${Date.now()}`;

    const client = new Client(
      CONFIG.broker.host,
      CONFIG.broker.port,
      CONFIG.broker.path,
      uniqueClientId
    );

    clientRef.current = client;

    client.onConnectionLost = (responseObject) => {
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
          const parsedPayload = JSON.parse(payload);
          setDeviceStatus(parsedPayload);
          setLastStatusReceived(Date.now());
        } catch (error) {
          console.error("Failed to parse device status:", error);
        }
      }

      if (topic === CONFIG.topics.rfidTopic) {
        try {
          const parsedPayload = JSON.parse(payload);
          setRfidPayload(parsedPayload);
          setLastStatusReceived(Date.now());

          if (parsedPayload.pid) {
            processRFIDAccess(parsedPayload.pid);
          }
        } catch (error) {
          console.error("Failed to parse RFID payload:", error);
        }
      }

      const logEntry = {
        time: now,
        action: "subscribe",
        message: payload,
        topic,
      };
      setMqttLogs((prev) => [logEntry, ...prev.slice(0, 99)]);
    };

    const connectOptions = {
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

      onFailure: (err) => {
        console.error("Connection failed:", err);
        setIsConnected(false);
        setStatus(`Failed: ${err.errorMessage || "Unknown error"}`);
        antdMessage.error(
          `Failed to connect: ${err.errorMessage || "Unknown error"}`
        );
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
      const delay = Math.min(
        3000 * connectAttemptsRef.current,
        15000
      );

      setStatus(
        `Reconnecting in ${delay / 1000}s (attempt ${connectAttemptsRef.current}/${maxReconnectAttempts})...`
      );

      setTimeout(() => {
        connect();
      }, delay);
    } else {
      setStatus(`Failed after ${maxReconnectAttempts} attempts. Please try again later.`);
      antdMessage.error(
        `Connection failed after ${maxReconnectAttempts} attempts. Please try again later.`
      );
    }
  };

  const sendMessage = (topic, payload) => {
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

  const getImageForProcessing = () => {
    try {
      if (webcamRef?.current?.captureImage) {
        console.log("Using webcam capture");
        return webcamRef.current.captureImage();
      }

      console.log("No image source available");
      antdMessage.warning("No image processing available");
      return null;
    } catch (error) {
      console.error("Error getting image:", error);
      antdMessage.error("Error getting image for processing");
      return null;
    }
  };

  const processRFIDAccess = async (pid) => {
    try {
      setIsProcessingRFID(true);
      const imageFile = webcamRef?.current?.captureImage?.();
      const accessResult = await accessLogsApi.processRFIDAccess(pid, imageFile);

      console.log("Access result:", accessResult);

      const user = await userService.getUserByPid(pid);
      console.log("User found:", user);

      const name = user ? user.name : pid;

      if (accessResult?.data?.access === true) {
        antdMessage.success(`Access granted for ${name}`);

        const gateOpenPayload = JSON.stringify({
          ...controlPayload,
          servo: "open",
        });

        sendMessage(CONFIG.topicPub.controlTopic, gateOpenPayload);
      } else {
        antdMessage.error(
          `Access denied for ${name}: ${accessResult.message}`
        );
      }

      return accessResult;
    } catch (error) {
      console.error("Error processing RFID access:", error);
      antdMessage.error("Error processing RFID access");
      setIsProcessingRFID(false);

      try {
        const errorResult = await accessLogsApi.processRFIDAccess(pid);
        return errorResult;
      } catch (logError) {
        console.error("Error logging access attempt:", logError);
        return null;
      }
    } finally {
      setIsProcessingRFID(false);
      setProcessingMessage("");

      window.dispatchEvent(
        new CustomEvent("rfidProcessComplete", {
          detail: { pid, timestamp: Date.now() },
        })
      );
    }
  };

  useEffect(() => {
    connect();

    const heartbeatChecker = setInterval(() => {
      const now = Date.now();
      if (now - lastStatusReceived > heartbeatTimeout) {
        setDeviceStatus((prev) => ({ ...prev, online: false }));
      }
    }, 10000);

    return () => {
      disconnect();
      clearInterval(heartbeatChecker);
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
        getImageForProcessing,
        webcamRef,
        isProcessingRFID,
        processingMessage,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};
