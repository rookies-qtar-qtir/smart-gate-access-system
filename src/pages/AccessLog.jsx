import { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Button, Input, Tag, Space, Row, Col, Statistic, message } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import StatusAlert from "../components/StatusAlert";
import { accessLogsApi } from '../services/api';
import { useMQTT } from '../services/MqttContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

  const { deviceStatus } = useMQTT();

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

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    // Filter by UID
    if (searchUid) {
      filtered = filtered.filter(log =>
        log.uid.toLowerCase().includes(searchUid.toLowerCase())
      );
    }

    // Filter by date range
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

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      defaultSortOrder: 'descend',
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 120,
      render: (uid) => <code className="bg-gray-100 px-2 py-1 rounded">{uid}</code>,
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'userName',
      width: 150,
      render: (name, record) => name || <span className="text-gray-400">Unknown User</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag
          color={status === 'GRANTED' ? 'green' : 'red'}
          icon={status === 'GRANTED' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Granted', value: 'GRANTED' },
        { text: 'Denied', value: 'DENIED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => reason || <span className="text-gray-400">-</span>,
    },
  ];

  return (
    <div className="p-6">
      <StatusAlert />

      {/* Statistics Cards */}
      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Access Attempts"
              value={stats.total}
              prefix={<SearchOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Granted Access"
              value={stats.granted}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Denied Access"
              value={stats.denied}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mt-4">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Search by UID"
              prefix={<SearchOutlined />}
              value={searchUid}
              onChange={(e) => setSearchUid(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filter by Status"
              value={filterStatus}
              onChange={handleStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Status</Option>
              <Option value="GRANTED">Granted</Option>
              <Option value="DENIED">Denied</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              value={dateRange}
              onChange={handleDateRangeFilter}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAccessLogs}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Access Logs Table */}
      <Card className="mt-4" title="Access Logs">
        <Table
          dataSource={filteredLogs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </div>
  );
}

export default AccessLog;