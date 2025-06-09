import React from "react";
import { Button } from "antd";
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";

const RFIDTestPublisher = () => {
    const { sendMessage } = useMQTT();

    const publishTestStatus = () => {
        const testPayload = {
            uid: "9e84ce000",
        };

        const success = sendMessage(CONFIG.topics.rfidTopic, JSON.stringify(testPayload));
        if (success) {
            console.log("Test status published");
        }
    };

    return <Button onClick={publishTestStatus}>Publish Test RFID</Button>;
};

export default RFIDTestPublisher;
