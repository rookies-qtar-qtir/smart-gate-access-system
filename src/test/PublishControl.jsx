import React from "react";
import { Button } from "antd";
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";

const TestPublisher = () => {
  const { sendMessage } = useMQTT();

  const publishControlPayload = () => {
    const testPayload = {
      servo: "1",
      threshold: 7,
    };

    const success = sendMessage(CONFIG.topics.controlTopic, JSON.stringify(testPayload));
    if (success) {
      console.log("Test status published");
    }
  };

  return <Button onClick={publishControlPayload}>Publish Test Control</Button>;
};

export default TestPublisher;