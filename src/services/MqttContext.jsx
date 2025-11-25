import { createContext, useContext } from "react";
export const MQTTContext = createContext();
export const useMQTT = () => useContext(MQTTContext);
