import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import StatusAlert from "../components/StatusAlert";
import AccessLogStats from "../components/AccessLogStats";
import AccessLogFilters from "../components/AccessLogFilters";
import AccessLogTable from "../components/AccessLogTable";
import { useAccessLog } from '../services/AccessLogContext';

function AccessLog() {
  const { accessLogs: globalAccessLogs, stats: globalStats, loading: globalLoading, refreshData } = useAccessLog();

  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchUid, setSearchUid] = useState('');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [globalAccessLogs, filterStatus, searchUid, dateRange]);

  useEffect(() => {
    const handleRFIDProcessComplete = async (event) => {
      console.log('RFID processing completed, refreshing access logs...', event.detail);
      try {
        await refreshData();
        // message.success(`UID: ${event.detail.pid} processed successfully`);
      } catch (error) {
        console.error('Failed to refresh access logs after RFID processing:', error);
      }
    };

    window.addEventListener('rfidProcessComplete', handleRFIDProcessComplete);

    return () => {
      window.removeEventListener('rfidProcessComplete', handleRFIDProcessComplete);
    };
  }, [refreshData]);

  const applyFilters = () => {
    let filtered = [...globalAccessLogs];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    if (searchUid) {
      filtered = filtered.filter(log =>
        log.pid.toLowerCase().includes(searchUid.toLowerCase())
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

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
  };

  const handleDateRangeFilter = (dates) => {
    setDateRange(dates);
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
      message.success('Data refreshed successfully');
    } catch (error) {
      message.error('Failed to refresh data');
    }
  };

  return (
    <div className="p-6">
      <StatusAlert />

      {/* Stats Section */}
      <div className="mb-3">
        <AccessLogStats stats={globalStats} />
      </div>

      {/* Filters Section */}
      <div className="my-3">
        <AccessLogFilters
          searchUid={searchUid}
          setSearchUid={setSearchUid}
          filterStatus={filterStatus}
          onStatusFilter={handleStatusFilter}
          dateRange={dateRange}
          onDateRangeFilter={handleDateRangeFilter}
          onRefresh={handleRefresh}
          loading={globalLoading}
        />
      </div>

      {/* Logs Table Section */}
      <AccessLogTable
        logs={filteredLogs}
        loading={globalLoading}
      />
    </div>
  );
}

export default AccessLog;