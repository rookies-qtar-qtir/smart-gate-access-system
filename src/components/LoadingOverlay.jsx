import React from 'react';
import { Spin, Modal } from 'antd';
import { LoadingOutlined, ScanOutlined } from '@ant-design/icons';

const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 48,
                color: '#1890ff',
            }}
            spin
        />
    );

    const scanIcon = (
        <ScanOutlined
            style={{
                fontSize: 24,
                color: '#1890ff',
                marginRight: 8,
            }}
        />
    );

    return (
        <Modal
            open={isVisible}
            footer={null}
            closable={false}
            centered
            width={400}
            styles={{
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                body: {
                    textAlign: 'center',
                },
            }}
        >
            <div style={{ padding: '20px 0' }}>
                <Spin indicator={antIcon} />
                <div style={{
                    marginTop: 20,
                    fontSize: 16,
                    color: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {scanIcon}
                    {message}
                </div>
                <div style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Please wait...
                </div>
            </div>
        </Modal>
    );
};

export default LoadingOverlay;
