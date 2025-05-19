import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, Message } from "paho-mqtt";
import { message as antdMessage } from "antd";
import CONFIG from "./Config";

const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const clientRef = useRef(null);
  const connectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

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
      console.log("Message arrived: ", topic, payload);
    };

    const connectOptions = {
      useSSL: CONFIG.broker.useSSL,
      keepAliveInterval: 30,
      cleanSession: true,
      reconnect: true,
      timeout: 10,
      onSuccess: () => {
        connectAttemptsRef.current = 0;
        setIsConnected(true);
        setStatus("Connected");
        antdMessage.success("Connected to MQTT broker");

        Object.values(CONFIG.topics).forEach((topic) => {
          try {
            client.subscribe(topic, { qos: 1 });
            console.log(`Subscribed to ${topic}`);
          } catch (error) {
            console.error(`Failed to subscribe to ${topic}:`, error);
          }
        });
      },
      onFailure: (err) => {
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

  const sendMessage = (topic, payload) => {
    if (clientRef.current && isConnected) {
      try {
        const mqttMessage = new Message(payload);
        mqttMessage.destinationName = topic;
        mqttMessage.qos = 1;
        clientRef.current.send(mqttMessage);
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

  useEffect(() => {
    connect();

    const pingInterval = setInterval(() => {
      if (clientRef.current && isConnected) {
        sendMessage(CONFIG.topics.devicePingTopic, JSON.stringify({ timestamp: Date.now() }));
      }
    }, 60000);

    return () => {
      disconnect();
      clearInterval(pingInterval);
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
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => useContext(MQTTContext);
