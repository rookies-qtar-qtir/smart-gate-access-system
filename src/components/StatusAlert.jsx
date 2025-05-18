import { useEffect } from 'react';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';
import { useMQTT } from '../services/Connection'; // GUNAKAN hook yang benar

const StatusAlert = () => {
  const { status, isConnected } = useMQTT(); // Ambil dari context

  return (
    <Alert
      banner
      message={
        <Marquee pauseOnHover gradient={false}>
          MQTT Status: {status} ({isConnected ? "Online" : "Offline"})
        </Marquee>
      }
      type={isConnected ? 'success' : 'error'}
    />
  );
};

export default StatusAlert;
