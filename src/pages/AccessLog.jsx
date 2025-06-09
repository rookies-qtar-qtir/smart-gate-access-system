import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs'; // pastikan kamu sudah import dayjs
import StatusAlert from "../components/StatusAlert";
import AccessLogStats from "../components/AccessLogStats";
import AccessLogFilters from "../components/AccessLogFilters";
import AccessLogTable from "../components/AccessLogTable";
import { accessLogsApi } from '../services/api';
import { useMQTT } from '../services/MqttContext';

function AccessLog() {
  const [accessLogs, setAccessLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchUid, setSearchUid] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    granted: 0,
    denied: 0,
  });

  useEffect(() => {
    fetchAccessLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accessLogs, filterStatus, searchUid, dateRange]);

  const fetchAccessLogs = async () => {
    setLoading(true);
    try {
      const logs = await accessLogsApi.getAll();
      setAccessLogs(logs);
      calculateStats(logs);
    } catch (error) {
      message.error('Failed to fetch access logs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logs) => {
    const granted = logs.filter(log => log.status === 'GRANTED').length;
    const denied = logs.filter(log => log.status === 'DENIED').length;
    setStats({
      total: logs.length,
      granted,
      denied,
    });
  };

  const applyFilters = () => {
    let filtered = [...accessLogs];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    if (searchUid) {
      filtered = filtered.filter(log =>
        log.uid.toLowerCase().includes(searchUid.toLowerCase())
      );
    }

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(log => {
        const logDate = dayjs(log.timestamp);
        return logDate.isAfter(start.startOf('day')) && logDate.isBefore(end.endOf('day'));
      });
    }

    setFilteredLogs(filtered);
  };

  const handleStatusFilter = async (value) => {
    setFilterStatus(value);
    if (value === 'GRANTED') {
      setLoading(true);
      try {
        const logs = await accessLogsApi.getGranted();
        setAccessLogs(logs);
      } catch (error) {
        message.error('Failed to fetch granted logs');
      } finally {
        setLoading(false);
      }
    } else if (value === 'DENIED') {
      setLoading(true);
      try {
        const logs = await accessLogsApi.getDenied();
        setAccessLogs(logs);
      } catch (error) {
        message.error('Failed to fetch denied logs');
      } finally {
        setLoading(false);
      }
    } else {
      fetchAccessLogs();
    }
  };

  const handleDateRangeFilter = async (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      setLoading(true);
      try {
        const logs = await accessLogsApi.getByDateRange(dates[0].toDate(), dates[1].toDate());
        setAccessLogs(logs);
      } catch (error) {
        message.error('Failed to fetch logs by date range');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <StatusAlert />

      {/* Stats Section */}
      <AccessLogStats stats={stats} />

      {/* Filters Section */}
      <AccessLogFilters
        searchUid={searchUid}
        setSearchUid={setSearchUid}
        filterStatus={filterStatus}
        onStatusFilter={handleStatusFilter}
        dateRange={dateRange}
        onDateRangeFilter={handleDateRangeFilter}
        onRefresh={fetchAccessLogs}
        loading={loading}
      />

      {/* Logs Table Section */}
      <AccessLogTable 
        logs={filteredLogs} 
        loading={loading} 
      />
    </div>
  );
}

export default AccessLog;
