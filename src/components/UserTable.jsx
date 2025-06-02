import { Table, Button, Popconfirm, Space } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";

function UserTable({ users, loading, onEditUser, onDeleteUser }) {
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
		},
		{
			title: "UID",
			dataIndex: "uid",
			key: "uid",
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

	return (
		<section className="bg-white shadow-sm p-6 rounded-lg mt-4">
			<h3 className="text-lg font-semibold mb-4">Users List</h3>
			<Table
				dataSource={users}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} of ${total} users`,
				}}
				className="border rounded-lg"
			/>
		</section>
	);
}

export default UserTable;
