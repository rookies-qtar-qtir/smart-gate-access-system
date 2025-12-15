import React, { useState, useEffect } from 'react';
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
import { accessLogsApi } from '../services/api';
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
  const [stats, setStats] = useState({
    total: 0,
    granted: 0,
    denied: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();

    // Listen for RFID events to refresh stats
    const handleRFIDComplete = () => {
      console.log('RFID event detected, refreshing summary...');
      fetchSummary();
    };

    window.addEventListener('rfidProcessComplete', handleRFIDComplete);

    return () => {
      window.removeEventListener('rfidProcessComplete', handleRFIDComplete);
    };
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const summary = await accessLogsApi.getSummary();
      setStats(summary);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

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
        />
      </div>
    </div>
  );
}

export default Home;