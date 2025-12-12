import { Modal, Form, Input, Button, Switch } from "antd";
import { UserOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";

function UserFormModal({
	visible,
	editingUser,
	loading,
	onSubmit,
	onCancel,
	form,
	checkPidUnique,
	checkEmailUnique,
}) {
	const validatePid = (_, value) => {
		if (!value) {
			return Promise.resolve();
		}

		if (!checkPidUnique(value, editingUser?.id)) {
			return Promise.reject(
				new Error("This PID already exists! Please use a unique PID.")
			);
		}

		return Promise.resolve();
	};

	const validateEmail = (_, value) => {
		if (!value) {
			return Promise.resolve();
		}

		if (!checkEmailUnique(value, editingUser?.id)) {
			return Promise.reject(
				new Error("This email already exists! Please use a unique email.")
			);
		}

		return Promise.resolve();
	};

	return (
		<Modal
			title={editingUser ? "Edit User" : "Add New User"}
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={500}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onSubmit}
				className="mt-4"
				initialValues={{ isActive: true }}>
				<Form.Item
					label="PID"
					name="pid"
					rules={[
						{ required: true, message: "Please input the PID!" },
						{
							min: 8,
							message: "PID must be at least 8 characters!",
						},
						{
							max: 32,
							message: "PID cannot exceed 32 characters!",
						},
						{
							pattern: /^[a-zA-Z0-9]+$/,
							message:
								"PID can only contain letters and numbers!",
						},
						{ validator: validatePid },
					]}
					hasFeedback>
					<Input
						prefix={<KeyOutlined />}
						placeholder="Enter PID (8–32 alphanumeric characters)"
						size="large"
						maxLength={32}
						style={{ fontFamily: "monospace" }}
						onChange={(e) => {
							const value = e.target.value.toLowerCase();
							form.setFieldsValue({ pid: value });
						}}
					/>
				</Form.Item>

				<Form.Item
					label="Name"
					name="name"
					rules={[
						{ required: true, message: "Please input the name!" },
						{
							min: 2,
							message: "Name must be at least 2 characters!",
						},
					]}>
					<Input
						prefix={<UserOutlined />}
						placeholder="Enter full name"
						size="large"
					/>
				</Form.Item>

				<Form.Item
					label="Email"
					name="email"
					rules={[
						{ required: true, message: "Please input the email!" },
						{
							type: "email",
							message: "Please enter a valid email!",
						},
						{ validator: validateEmail },
					]}
					hasFeedback>
					<Input
						prefix={<MailOutlined />}
						placeholder="Enter email address"
						size="large"
					/>
				</Form.Item>

				<Form.Item
					label="Plate Number"
				>
					<Form.List name="plateNumber" rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(new Error('Please input at least one plate number!'));
								}
							},
						},
					]}>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Form.Item
										key={key}
										required
										{...restField}
										name={name}
										rules={[{ required: false, message: 'Please input the plate number!' }]}
									>
										<Input
											placeholder="Enter plate number"
											size="large"
											addonAfter={
												fields.length > 1 ? (
													<a onClick={() => remove(name)} style={{ color: 'red' }}>Remove</a>
												) : null
											}
										/>
									</Form.Item>
								))}
								<Form.Item>
									<a onClick={() => add()}>+ Add Plate Number</a>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form.Item>

				<Form.Item
					label="Status"
					name="isActive"
					valuePropName="checked">
					<Switch
						checkedChildren="Active"
						unCheckedChildren="Inactive"
						size="default"
					/>
				</Form.Item>

				<Form.Item className="mb-0 pt-4">
					<div className="flex justify-end space-x-2">
						<Button onClick={onCancel} size="large">
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							size="large">
							{editingUser ? "Update User" : "Create User"}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default UserFormModal;