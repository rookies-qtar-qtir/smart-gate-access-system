import { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { userService } from "../services/api";
import StatusAlert from "../components/StatusAlert";
import UserSearch from "../components/UserSearch";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import PinModal from "../components/PinModal";

function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [onUserUpdatedCallback, setOnUserUpdatedCallback] = useState(null);
	const [isPinOpen, setIsPinOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [deleteCallback, setDeleteCallback] = useState(null);
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

	const checkPidUnique = (pid, excludeId = null) => {
		return !users.some(
			(user) =>
				user.pid.toLowerCase() === pid.toLowerCase() &&
				user.id !== excludeId
		);
	};

	const checkEmailUnique = (email, excludeId = null) => {
		return !users.some(
			(user) =>
				user.email.toLowerCase() === email.toLowerCase() &&
				user.id !== excludeId
		);
	};

	const handleSubmit = async (values) => {
		console.log("Form values submitted:", values);

		if (!editingUser && !checkPidUnique(values.pid)) {
			message.error("PID already exists! Please use a unique PID.");
			return;
		}

		if (editingUser && !checkPidUnique(values.pid, editingUser.id)) {
			message.error("PID already exists! Please use a unique PID.");
			return;
		}
		
		if (!editingUser && !checkEmailUnique(values.email)) {
			message.error("Email already exists! Please use a unique email.");
			return;
		}

		if (editingUser && !checkEmailUnique(values.email, editingUser.id)) {
			message.error("Email already exists! Please use a unique email.");
			return;
		}

		setLoading(true);
		try {
			const userData = {
				pid: values.pid,
				name: values.name,
				email: values.email,
				isActive: values.isActive !== undefined ? values.isActive : true,
				plateNumber: values.plateNumber || []
			};

			console.log("Sending userData:", userData);

			if (editingUser) {
				await userService.updateUser(editingUser.id, userData);
				message.success("User updated successfully");
			} else {
				await userService.createUser(userData);
				message.success("User created successfully");
			}
			setModalVisible(false);
			setEditingUser(null);
			form.resetFields();
			fetchUsers();
			
			if (onUserUpdatedCallback) {
				onUserUpdatedCallback();
				setOnUserUpdatedCallback(null);
			}
		} catch (error) {
			if (error.message && error.message.includes("PID")) {
				message.error("PID already exists! Please use a unique PID.");
			} else if (error.message && error.message.includes("email")) {
				message.error("Email already exists! Please use a unique email.");
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

	const handleDelete = (userId) => {
		setSelectedUserId(userId);
		setIsPinOpen(true);
	};

	const handleDeleteWithCallback = (userId, onSuccess) => {
		setDeleteCallback(() => onSuccess || null);
		handleDelete(userId);
	};

	const handleUserUpdated = (callback) => {
		setOnUserUpdatedCallback(() => callback);
	};

	const handleEditUser = (user = null) => {
		setEditingUser(user);
		setModalVisible(true);

		if (user) {
			form.setFieldsValue({
				pid: user.pid,
				name: user.name,
				email: user.email,
				isActive: user.isActive,
				plateNumber: user.plateNumber || []
			});
		} else {
			form.resetFields();
			form.setFieldsValue({
				isActive: true,
				plateNumber: [""]
			});
		}
	};

	const closeModal = () => {
		setModalVisible(false);
		setEditingUser(null);
		form.resetFields();
	};

	const handlePinClose = () => {
		setIsPinOpen(false);
		setSelectedUserId(null);
		setDeleteCallback(null);
	};

	const handleUserDeleted = () => {
		fetchUsers();
		if (deleteCallback) {
			deleteCallback();
			setDeleteCallback(null);
		}
		setSelectedUserId(null);
	};

	return (
		<div className="p-6">
			<StatusAlert />

			{/* Header Section */}
			<div className="bg-white shadow-sm p-6 rounded-lg mt-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="text-gray-600">
							Manage system users and their status here.
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
				onDeleteUser={handleDeleteWithCallback}
				onUserUpdated={handleUserUpdated}
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
				checkPidUnique={checkPidUnique}
				checkEmailUnique={checkEmailUnique}
			/>

			<PinModal
				open={isPinOpen}
				userId={selectedUserId}
				onCancel={handlePinClose}
				onDeleted={handleUserDeleted}
			/>
		</div>
	);
}

export default Users;
