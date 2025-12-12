import React from 'react';
import { Button } from 'antd';
import { CameraOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const FloatingWebcamButton = ({ webcamRef, onHideShow }) => {
  const [isHidden, setIsHidden] = React.useState(false);

  const toggleWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.toggle();
    }
  };

  const toggleVisibility = () => {
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState);
    if (onHideShow) {
      onHideShow(newHiddenState);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      {/* Main webcam toggle button */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<CameraOutlined />}
        onClick={toggleWebcam}
        style={{
          width: 56,
          height: 56,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '20px'
        }}
        title="Toggle Webcam"
      />
      
      {/* Small hide/show button */}
      <Button
        type="default"
        shape="circle"
        size="small"
        icon={isHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={toggleVisibility}
        style={{
          width: 32,
          height: 32,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          fontSize: '12px',
          alignSelf: 'center'
        }}
        title={isHidden ? "Show Camera View" : "Hide Camera View"}
      />
    </div>
  );
};

export default FloatingWebcamButton;