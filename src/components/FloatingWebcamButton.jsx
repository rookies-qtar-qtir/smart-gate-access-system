import React from 'react';
import { Button } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const FloatingWebcamButton = ({ webcamRef }) => {
  const toggleWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.toggle();
    }
  };

  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      icon={<CameraOutlined />}
      onClick={toggleWebcam}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9998,
        width: 56,
        height: 56,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontSize: '20px'
      }}
      title="Toggle Webcam"
    />
  );
};

export default FloatingWebcamButton;