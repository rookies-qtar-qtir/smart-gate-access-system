import { createContext, useContext } from "react";
import type { MqttContextValue } from "../domain/mqtt";

export const MQTTContext = createContext<MqttContextValue | undefined>(undefined);

export const useMQTT = (): MqttContextValue => {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error("useMQTT must be used within an MQTTProvider");
  }
  return context;
};
