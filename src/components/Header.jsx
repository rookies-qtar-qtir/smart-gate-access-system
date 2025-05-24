import { Button } from "antd";
import { Col, Row, Divider } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const CustomHeader = ({ collapsed, setCollapsed }) => {
    const location = window.location;

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
                        <>
                        </>
                    )}
                    {location.pathname === "/gate-control" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">Sistem Kontrol Gerbang Palang</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1">-</span>
                            </div>
                        </div>
                    )}
                    {location.pathname === "/access-log" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">RFID Access Logs</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1" id="last-update">-</span>
                            </div>
                        </div>
                    )}
                    {location.pathname === "/users" && (
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-2xl font-bold text-black inline-block align-middle">User Management</p>
                            <div className="text-sm text-gray-500 min-w-56 flex flex-row items-center">
                                <span className="mr-1">Last update: </span>
                                <span className="font-mono flex-1" id="last-update">-</span>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </header >
    );
};

export default CustomHeader;