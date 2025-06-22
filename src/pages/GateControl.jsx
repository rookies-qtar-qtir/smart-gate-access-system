import StatusAlert from "../components/StatusAlert";
import GateControlButtons from "../components/GateControlButtons";
import GateConfiguration from "../components/GateConfiguration";
import GateStatusMonitor from "../components/GateStatusMonitor";
import ActivityLog from "../components/ActivityLog";
import WebcamComponent from "../components/Webcam";
import { Col, Row } from "antd";
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";

function GateControl() {
	const { deviceStatus, sendMessage, mqttLogs } = useMQTT();

	const handleGateControl = (servoStatus) => {
		const statusPayload = JSON.stringify({
			...deviceStatus,
			servo: servoStatus,
		});
		sendMessage(CONFIG.topics.statusTopic, statusPayload);
	};

	const handleModeChange = (mode) => {
		const statusPayload = JSON.stringify({
			...deviceStatus,
			auto_mode: mode,
		});
		sendMessage(CONFIG.topics.statusTopic, statusPayload);
	};

	const handleThresholdChange = (threshold) => {
		const statusPayload = JSON.stringify({
			...deviceStatus,
			threshold: threshold,
		});
		sendMessage(CONFIG.topics.statusTopic, statusPayload);
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

			{/* Webcam Section */}
			<Row gutter={16} style={{ marginTop: "16px" }}>
				<Col span={24}>
					<WebcamComponent />
				</Col>
			</Row>

			<div style={{ marginTop: "16px" }}>
				<GateStatusMonitor deviceStatus={deviceStatus} />
			</div>

			<div style={{ marginTop: "16px" }}>
				<ActivityLog mqttLogs={mqttLogs} />
			</div>
		</div>
	);
}

export default GateControl;