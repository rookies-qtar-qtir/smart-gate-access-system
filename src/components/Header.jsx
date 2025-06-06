import { Button } from "antd";
import { Col, Row, Divider } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useMQTT } from "../services/MqttContext";

const CustomHeader = ({ collapsed, setCollapsed }) => {
    const location = window.location;
    const { lastStatusReceived } = useMQTT();

    // Format the timestamp for display
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "-";
        const date = new Date(timestamp);
        return date.toLocaleTimeString() + ", " + date.toLocaleDateString();
    };

    return (
        <header className="bg-white shadow-md p-4 items-center">
            <Row gutter={{ xs: 4, sm: 8, md: 16, lg: 24 }} className="flex-col flex">
                <Col>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 32,
                            height: 32,
                        }}
                    />
                </Col>

                <Col>
                </Col>

                <Col span={22}>
                    {location.pathname === "/" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">Dashboard</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1">{formatTimestamp(lastStatusReceived)}</span>
                            </div>
                        </div>
                    )}
                    {location.pathname === "/gate-control" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">Sistem Kontrol Gerbang Palang</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1">{formatTimestamp(lastStatusReceived)}</span>
                            </div>
                        </div>
                    )}
                    {location.pathname === "/access-log" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">RFID Access Logs</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1" id="last-update">{formatTimestamp(lastStatusReceived)}</span>
                            </div>
                        </div>
                    )}
                    {location.pathname === "/users" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">User Management</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1" id="last-update">{formatTimestamp(lastStatusReceived)}</span>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </header >
    );
};

export default CustomHeader;