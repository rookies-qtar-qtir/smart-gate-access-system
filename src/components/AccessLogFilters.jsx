import { Card, Row, Col, Input, Select, DatePicker, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

function AccessLogFilters({
	searchUid,
	setSearchUid,
	filterStatus,
	onStatusFilter,
	dateRange,
	onDateRangeFilter,
	onRefresh,
	loading,
}) {
	return (
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
						onChange={onStatusFilter}
						style={{ width: "100%" }}>
						<Option value="all">All Status</Option>
						<Option value="GRANTED">Granted</Option>
						<Option value="DENIED">Denied</Option>
					</Select>
				</Col>
				<Col span={8}>
					<RangePicker
						placeholder={["Start Date", "End Date"]}
						value={dateRange}
						onChange={onDateRangeFilter}
						style={{ width: "100%" }}
					/>
				</Col>
				<Col span={4}>
					<Space>
						<Button
							icon={<ReloadOutlined />}
							onClick={onRefresh}
							loading={loading}>
							Refresh
						</Button>
					</Space>
				</Col>
			</Row>
		</Card>
	);
}

export default AccessLogFilters;
