import StatusAlert from "../components/StatusAlert";
import DistanceBar from "../components/DistanceBar";
import { Col, Row, Button, Switch, InputNumber, Table } from 'antd';
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMQTT } from "../services/MqttContext";
import CONFIG from "../services/Config";
import { useState } from "react";

function GateControl() {
  const { deviceStatus, sendMessage, mqttLogs } = useMQTT();
  const [thresholdValue, setThresholdValue] = useState(deviceStatus.threshold);

  const handleThreshold = () => {
    const statusPayload = JSON.stringify({
      ...deviceStatus,
      threshold: thresholdValue ?? deviceStatus.threshold,
    });

    sendMessage(CONFIG.topics.statusTopic, statusPayload);
  };

  const handleGate = (servoStatus) => {
    const statusPayload = JSON.stringify({
      ...deviceStatus,
      servo: servoStatus,
    });

    sendMessage(CONFIG.topics.statusTopic, statusPayload);
  };

  const handleMode = (mode) => {
    const statusPayload = JSON.stringify({
      ...deviceStatus,
      auto_mode: mode,
    });

    sendMessage(CONFIG.topics.statusTopic, statusPayload);
  };


  // Table columns and data
  const columns = [
    { title: "Time", dataIndex: "time", key: "time", width: 180 },
    { title: "Action", dataIndex: "action", key: "action", width: 100 },
    { title: "Topic", dataIndex: "topic", key: "topic", width: 200 },
    { title: "Message", dataIndex: "message", key: "message" },
  ];


  return (
    <div className="p-6">
      <StatusAlert />
      {/* Section 1 */}
      <Row gutter={16}>
        {/* Section Manual Gate Control */}
        <Col span={12}>
          <div className="bg-white shadow-sm p-6 rounded-lg mt-4">
            <h2 className="text-xl font-semibold">Gate Control</h2>
            <p className="mb-4">Control the gate status here.</p>
            <div className="items-center">
              <Button
                type="primary"
                size="large"
                icon={<FaDoorOpen />}
                className="mx-2"
                onClick={() => {
                  console.log("Open Gate");
                  handleGate("1");
                }}
              >
                Open Gate
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                icon={<FaDoorClosed />}
                className="mx-2"
                onClick={() => {
                  console.log("Close Gate");
                  handleGate("0");
                }}
              >
                Close Gate
              </Button>
            </div>
          </div>
        </Col>

        {/* Section Gate Status and Distance Threshold */}
        <Col span={12}>
          <section className="bg-white shadow-sm p-6 rounded-lg mt-4">
            <h2 className="text-xl font-semibold mb-4">Gate Configuration</h2>
            <p>Gate Closing Sensor:</p>
            <Switch
              checkedChildren="Auto"
              unCheckedChildren="Man"
              checked={deviceStatus.auto_mode == 'manual' ? false : true}
              onChange={(checked) => {
                const value = checked ? "auto" : "manual";
                console.log("Switch to", value);
                handleMode(value);
              }}
            />
            <div>
              <p className="mt-4">Distance Threshold:</p>
              <InputNumber
                suffix="cm"
                keyboard={false}
                style={{ width: '25%' }}
                placeholder={deviceStatus.threshold}
                value={thresholdValue}
                onChange={(value) => setThresholdValue(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleThreshold();
                  }
                }}
              />
            </div>
          </section>
        </Col>
      </Row>

      {/* Section 2: Gate Status Monitor */}
      <section className="bg-white shadow-sm p-6 rounded-lg mt-4 text-left">
        <p className="-top-10! start-0!">Gate Status Monitor</p>
        <Row gutter={8}>
          <Col span={12} className="border-2 rounded-lg border-gray-200 p-6">
            <p>Current Status: </p>
            <span className="font-semibold text-xl">{deviceStatus.servo == '1' ? "Open" : "Closed"}</span>
          </Col>
          <Col span={12}>
            <p>Current Status: </p>
            <DistanceBar></DistanceBar>
          </Col>
        </Row>
      </section>


      {/* Section 3: Activity log */}
      <section className="bg-white shadow-sm p-6 rounded-lg mt-4 text-left">
        <p className="-top-10! start-0!">All Log</p>
        <Table dataSource={mqttLogs} columns={columns} rowKey={(record, i) => i} pagination={{ pageSize: 10 }} />
      </section>
    </div>
  );
}
export default GateControl;