import React from "react";
import { Button } from "antd";
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";

const TestPublisher = () => {
  const { sendMessage } = useMQTT();

  const publishTestStatus = () => {
    const testPayload = {
      online: true,
      servo: 1,
      auto_mode: true,
      ip: "192.168.1.100",
      rssi: 60,
      distance: 7,
      threshold: 7,
    };

    const success = sendMessage(CONFIG.topics.statusTopic, JSON.stringify(testPayload));
    if (success) {
      console.log("Test status published");
    }
  };

  return <Button onClick={publishTestStatus}>Publish Test Status</Button>;
};

export default TestPublisher;
