import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client, Message } from "paho-mqtt";
import { message as antdMessage } from "antd";
import CONFIG from "./Config";

const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [clientId, setClientId] = useState(null);
  const reconnectRef = useRef(null);
  const clientRef = useRef(null);

  const connect = () => {
    const client = new Client(
      CONFIG.broker.host,
      CONFIG.broker.port,
      CONFIG.broker.path,
      CONFIG.broker.clientId
    );
    clientRef.current = client;

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
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

    client.connect({
      useSSL: CONFIG.broker.useSSL,
      onSuccess: () => {
        setIsConnected(true);
        setStatus("Connected");
        setClientId(client.clientId);
        antdMessage.success("Connected to MQTT broker");

        Object.values(CONFIG.topics).forEach((topic) => {
          client.subscribe(topic, { qos: 1 });
        });
      },
      onFailure: () => {
        setIsConnected(false);
        setStatus("Disconnected");
        antdMessage.error("Failed to connect to MQTT broker");
        attemptReconnect();
      },
    });
  };

  const attemptReconnect = () => {
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    reconnectRef.current = setTimeout(() => {
      connect();
    }, 3000);
  };

  const sendMessage = (topic, payload) => {
    if (clientRef.current && isConnected) {
      const mqttMessage = new Message(payload);
      mqttMessage.destinationName = topic;
      clientRef.current.send(mqttMessage);
    } else {
      antdMessage.warning("Client is not connected");
    }
  };

  useEffect(() => {
    connect();
    return () => {
      clientRef.current?.disconnect();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, []);

  return (
    <MQTTContext.Provider
      value={{
        isConnected,
        status,
        clientId,
        sendMessage,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => useContext(MQTTContext);
