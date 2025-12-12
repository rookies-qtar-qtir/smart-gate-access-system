import { Table, Button, Popconfirm, Space, Tag } from "antd";
import {
	UserOutlined,
	EditOutlined,
	DeleteOutlined,
	MailOutlined,
	KeyOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	NumberOutlined,
} from "@ant-design/icons";
import { useState } from "react";

function UserTable({ users, loading, onEditUser, onDeleteUser }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
		},
		{
			title: "PID",
			dataIndex: "pid",
			key: "pid",
			width: 170,
			render: (text) => (
				<span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">
					<KeyOutlined className="mr-2" />
					{text}
				</span>
			),
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (text) => (
				<span className="font-medium">
					<UserOutlined className="mr-2" />
					{text}
				</span>
			),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (text) => (
				<span className="font-medium">
					<MailOutlined className="mr-2" />
					{text}
				</span>
			),
		},
		{
			title: "Status",
			dataIndex: "isActive",
			key: "isActive",
			width: 100,
			render: (isActive) => (
				<Tag
					color={isActive ? "green" : "red"}
					icon={
						isActive ? (
							<CheckCircleOutlined />
						) : (
							<CloseCircleOutlined />
						)
					}>
					{isActive ? "Active" : "Inactive"}
				</Tag>
			),
			filters: [
				{ text: "Active", value: true },
				{ text: "Inactive", value: false },
			],
			onFilter: (value, record) => record.isActive === value,
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			render: (text) => (
				<span className="font-medium">
					{text.charAt(0).toUpperCase() + text.slice(1)}
				</span>
			),
			filters: [
				{ text: "ADMIN", value: "ADMIN" },
				{ text: "PENGHUNI", value: "PENGHUNI" },
			],
			onFilter: (value, record) => record.role === value,
		},
		{
			title: "Plate Number",
			dataIndex: "plateNumber",
			key: "plateNumber",
			width: 200,
			render: (plateNumbers) => {
				if (Array.isArray(plateNumbers) && plateNumbers.length > 0) {

					const validPlates = plateNumbers.filter(plate => plate && plate.trim() !== "");
					
					if (validPlates.length > 0) {
						return (
							<div className="flex flex-wrap gap-1">
								{validPlates.map((plate, index) => (
									<Tag
										key={index}
										color="blue"
										icon={<NumberOutlined />}
										className="mb-1"
									>
										{plate}
									</Tag>
								))}
							</div>
						);
					}
				}
				
				if (typeof plateNumbers === "string" && plateNumbers.trim() !== "") {
					return (
						<Tag color="blue" icon={<NumberOutlined />}>
							{plateNumbers}
						</Tag>
					);
				}
				
				return (
					<Tag color="default">
						No Plate
					</Tag>
				);
			},
			filters: [
				{ text: "With Plate", value: true },
				{ text: "Without Plate", value: false },
			],
			onFilter: (value, record) => {
				const hasPlate = () => {
					if (Array.isArray(record.plateNumber)) {
						return record.plateNumber.some(plate => plate && plate.trim() !== "");
					}
					if (typeof record.plateNumber === "string") {
						return record.plateNumber.trim() !== "";
					}
					return false;
				};

				if (value === true) {
					return hasPlate();
				}
				if (value === false) {
					return !hasPlate();
				}
				return true;
			},
		},
		{
			title: "Actions",
			key: "actions",
			width: 150,
			render: (_, record) => (
				<Space size="small">
					<Button
						type="primary"
						size="small"
						icon={<EditOutlined />}
						onClick={() => onEditUser(record)}>
						Edit
					</Button>
					<Popconfirm
						title="Delete User"
						description="Are you sure you want to delete this user?"
						onConfirm={() => onDeleteUser(record.id)}
						okText="Yes"
						cancelText="No">
						<Button
							type="primary"
							danger
							size="small"
							icon={<DeleteOutlined />}>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
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
				Users List
				<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
					{users?.length || 0}
				</span>
			</h3>
			<Table
				dataSource={users}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					position: ["bottomCenter"],
					current: currentPage,
					pageSize: pageSize,
					total: users?.length || 0,
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ["10", "20", "50", "100"],
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} users`,
					onChange: handlePaginationChange,
					onShowSizeChange: handleShowSizeChange,
				}}
				scroll={{ x: 800 }}
				className="border rounded-lg"
			/>
		</section>
	);
}

export default UserTable;