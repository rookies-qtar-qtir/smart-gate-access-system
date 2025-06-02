import { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { userService } from "../services/api";
import StatusAlert from "../components/StatusAlert";
import UserSearch from "../components/UserSearch";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";

function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [form] = Form.useForm();

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userData = await userService.getUsers();
			setUsers(userData);
		} catch (error) {
			message.error("Failed to fetch users");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const checkUidUnique = (uid, excludeId = null) => {
		return !users.some(
			(user) =>
				user.uid.toLowerCase() === uid.toLowerCase() &&
				user.id !== excludeId
		);
	};

	const handleSubmit = async (values) => {
		if (!editingUser && !checkUidUnique(values.uid)) {
			message.error("UID already exists! Please use a unique UID.");
			return;
		}

		if (editingUser && !checkUidUnique(values.uid, editingUser.id)) {
			message.error("UID already exists! Please use a unique UID.");
			return;
		}

		setLoading(true);
		try {
			if (editingUser) {
				await userService.updateUser(editingUser.id, values);
				message.success("User updated successfully");
			} else {
				await userService.createUser(values);
				message.success("User created successfully");
			}
			setModalVisible(false);
			setEditingUser(null);
			form.resetFields();
			fetchUsers();
		} catch (error) {
			if (error.message && error.message.includes("UID")) {
				message.error("UID already exists! Please use a unique UID.");
			} else {
				message.error(
					`Failed to ${editingUser ? "update" : "create"} user`
				);
			}
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (userId) => {
		setLoading(true);
		try {
			await userService.deleteUser(userId);
			message.success("User deleted successfully");
			fetchUsers();
		} catch (error) {
			message.error("Failed to delete user");
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEditUser = (user = null) => {
		setEditingUser(user);
		setModalVisible(true);

		if (user) {
			form.setFieldsValue(user);
		} else {
			form.resetFields();
		}
	};

	const closeModal = () => {
		setModalVisible(false);
		setEditingUser(null);
		form.resetFields();
	};

	return (
		<div className="p-6">
			<StatusAlert />

			{/* Header Section */}
			<div className="bg-white shadow-sm p-6 rounded-lg mt-4">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-xl font-semibold">
							User Management
						</h2>
						<p className="text-gray-600">
							Manage system users here.
						</p>
					</div>
					<Button
						type="primary"
						size="large"
						icon={<PlusOutlined />}
						onClick={() => handleEditUser()}>
						Add New User
					</Button>
				</div>
			</div>

			{/* Search User Component */}
			<UserSearch
				onEditUser={handleEditUser}
				onDeleteUser={handleDelete}
			/>

			{/* Users Table Component */}
			<UserTable
				users={users}
				loading={loading}
				onEditUser={handleEditUser}
				onDeleteUser={handleDelete}
			/>

			{/* Form Modal Component */}
			<UserFormModal
				visible={modalVisible}
				editingUser={editingUser}
				loading={loading}
				onSubmit={handleSubmit}
				onCancel={closeModal}
				form={form}
				users={users}
				checkUidUnique={checkUidUnique}
			/>
		</div>
	);
}

export default Users;
