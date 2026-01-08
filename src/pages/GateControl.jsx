import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import StatusAlert from "../components/StatusAlert";
import GateControlButtons from "../components/GateControlButtons";
import GateConfiguration from "../components/GateConfiguration";
import GateStatusMonitor from "../components/GateStatusMonitor";
import ActivityLog from "../components/ActivityLog";
import { Col, Row } from "antd";
import { useMQTT } from "../services/MqttContext";
import { accessLogsApi } from '../services/api';
import CONFIG from "../services/Config";

function GateControl() {
	const { deviceStatus, sendMessage, mqttLogs } = useMQTT();
	const [isManualOpen, setIsManualOpen] = useState(false);
	const previousServoStatus = useRef(null);

	useEffect(() => {
		if (isManualOpen && deviceStatus?.servo === "open" && previousServoStatus.current !== "open") {
			logManualOpen();
			setIsManualOpen(false);
		}
		previousServoStatus.current = deviceStatus?.servo;
	}, [deviceStatus?.servo, isManualOpen]);

	const logManualOpen = async () => {
		try {
			const response = await accessLogsApi.openManual();
			if (response.statusCode === 200) {
				message.success('Palang dibuka manual, log tercatat');
			}
		} catch (error) {
			console.error('Failed to log manual open:', error);
			message.error('Palang terbuka, tapi gagal mencatat log');
		}
	};

	const handleGateControl = (servoStatus) => {
		if (servoStatus === "open") {
			setIsManualOpen(true);
		}

		const controlPayload = JSON.stringify({
			servo: servoStatus,
		});
		sendMessage(CONFIG.topicPub.controlTopic, controlPayload);
	};

	const handleModeChange = (mode) => {
		const controlPayload = JSON.stringify({
			...deviceStatus,
			auto_mode: mode,
		});
		sendMessage(CONFIG.topicPub.controlTopic, controlPayload);
	};

	const handleThresholdChange = (threshold) => {
		const controlPayload = JSON.stringify({
			threshold: threshold,
		});
		sendMessage(CONFIG.topicPub.controlTopic, controlPayload);
	};

	return (
		<div className="p-6">
			<StatusAlert />

			<Row gutter={16}>
				<Col span={12}>
					<GateControlButtons onGateControl={handleGateControl} />
				</Col>
				<Col span={12}>
					<GateConfiguration
						deviceStatus={deviceStatus}
						onModeChange={handleModeChange}
						onThresholdChange={handleThresholdChange}
					/>
				</Col>
			</Row>

			<div style={{ marginTop: "32px" }}>
				<GateStatusMonitor deviceStatus={deviceStatus} />
			</div>

			<div style={{ marginTop: "16px" }}>
				<ActivityLog mqttLogs={mqttLogs} />
			</div>
		</div>
	);
}

export default GateControl;