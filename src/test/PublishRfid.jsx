import React from "react";
import { Button } from "antd";
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";

const RFIDTestPublisher = () => {
    const { sendMessage } = useMQTT();

    const publishTestStatus = () => {
        const testPayload = {
			uid: "4e2549c51",
		};

        const success = sendMessage(CONFIG.topics.rfidTopic, JSON.stringify(testPayload));
        if (success) {
            console.log("Test status published");
        }
    };

    return <Button onClick={publishTestStatus}>Publish Test RFID</Button>;
};

export default RFIDTestPublisher;
