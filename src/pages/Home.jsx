import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import StatusAlert from "../components/StatusAlert";
import { useMQTT } from "../services/MqttContext";
import { useAccessLog } from '../services/AccessLogContext';
import HeroBanner from '../components/HeroBanner';
import SystemStatus from '../components/SystemStatus';
import AccessStatistics from '../components/AccessStatistics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Home() {
  const { deviceStatus } = useMQTT();
  const { stats, loading, accessLogs, initialized } = useAccessLog();

  return (
    <div className="">
      <HeroBanner />
      
      <div className="p-6">
        <StatusAlert />
        
        {/* Status Sistem */}
        <SystemStatus deviceStatus={deviceStatus} />

        {/* Statistik Akses */}
        <AccessStatistics 
          stats={stats} 
          loading={loading} 
          accessLogs={accessLogs} 
        />
      </div>
    </div>
  );
}

export default Home;