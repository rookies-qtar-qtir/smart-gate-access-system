import { Table, Tag } from "antd";
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	UserOutlined,
	KeyOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

function AccessLogTable({ logs, loading }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const columns = [
		{
			title: "Timestamp",
			dataIndex: "timestamp",
			key: "timestamp",
			width: 180,
			render: (timestamp) =>
				dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss"),
			sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
			defaultSortOrder: "descend",
		},
		{
			title: "Vehicle",
			dataIndex: "vehicle",
			key: "vehicle",
			width: 150,
			render: (vehicle) => (
				<span className="font-medium">
					{vehicle ? vehicle : <span className="text-gray-400">Unknown</span>}
				</span>
			),
		},
		{
			title: "Plate Number",
			dataIndex: "plateNumber",
			key: "plateNumber",
			width: 150,
			render: (plateNumber) => (
				<span className="font-medium">
					{plateNumber || <span className="text-gray-400">Unknown</span>}
				</span>
			),
		},
		{
			title: "UID",
			dataIndex: "pid",
			key: "pid",
			width: 170,
			render: (pid) => (
				<span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">
					<KeyOutlined className="mr-2" />
					{pid}
				</span>
			),
		},
		{
			title: "User",
			dataIndex: ["user", "name"],
			key: "userName",
			width: 150,
			render: (name, record) =>
				name ? (
					<span className="font-medium">
						<UserOutlined className="mr-2" />
						{name}
					</span>
				) : (
					<span className="text-gray-400">Unknown User</span>
				),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: (status) => (
				<Tag
					color={status === "GRANTED" ? "green" : "red"}
					icon={
						status === "GRANTED" ? (
							<CheckCircleOutlined />
						) : (
							<CloseCircleOutlined />
						)
					}>
					{status}
				</Tag>
			),
			filters: [
				{ text: "Granted", value: "GRANTED" },
				{ text: "Denied", value: "DENIED" },
			],
			onFilter: (value, record) => record.status === value,
		},
		{
			title: "Reason",
			dataIndex: "reason",
			key: "reason",
			render: (reason) =>
				reason || <span className="text-gray-400">-</span>,
		},
	];

	const handlePaginationChange = (page, size) => {
		setCurrentPage(page);
		if (size !== pageSize) {
			setPageSize(size);
		}
	};

	const handleShowSizeChange = (current, size) => {
		setCurrentPage(1);
		setPageSize(size);
	};

	return (
		<section className="bg-white shadow-sm p-6 rounded-lg mt-4">
			<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
				Access Logs
				<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
					{logs?.length || 0}
				</span>
			</h3>
			<Table
				dataSource={logs}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					position: ["bottomCenter"],
					current: currentPage,
					pageSize: pageSize,
					total: logs?.length || 0,
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ["10", "20", "50", "100"],
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} access logs`,
					onChange: handlePaginationChange,
					onShowSizeChange: handleShowSizeChange,
				}}
				scroll={{ x: 800 }}
				className="border rounded-lg"
			/>
		</section>
	);
}

export default AccessLogTable;
