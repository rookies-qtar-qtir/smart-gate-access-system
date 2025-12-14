import { useState } from "react";
import { Button, Input, message, Popconfirm, Tag } from "antd";
import {
	SearchOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import { userService } from "../services/api";

function UserSearch({ onEditUser, onDeleteUser, onUserUpdated }) {
	const [searchUid, setSearchUid] = useState("");
	const [searchResult, setSearchResult] = useState(null);
	const [searchLoading, setSearchLoading] = useState(false);

	const handleSearchByUid = async () => {
		if (!searchUid.trim()) {
			message.warning("Please enter a UID to search");
			return;
		}

		setSearchLoading(true);
		try {
			const user = await userService.getUserByUid(searchUid.trim());
			setSearchResult(user);
			message.success("User found successfully");
		} catch (error) {
			setSearchResult(null);
			message.error("User not found or error occurred");
			console.error("Error:", error);
		} finally {
			setSearchLoading(false);
		}
	};

	const clearSearch = () => {
		setSearchUid("");
		setSearchResult(null);
	};

	const handleEdit = (user) => {
		onEditUser(user);
		if (onUserUpdated) {
			onUserUpdated(() => {
				handleSearchByUid();
			});
		}
	};

	const handleDelete = async (userId) => {
		await onDeleteUser(userId);
		setSearchResult(null);
		setSearchUid("");
	};

	return (
		<section className="bg-white shadow-sm rounded-lg mt-4">
			<div className="p-6">
				<div className="max-w-2xl">
					<div className="flex gap-3">
						<div className="flex-1">
							<Input
								placeholder="Enter UID (e.g., 9e84ce05)"
								value={searchUid}
								onChange={(e) => setSearchUid(e.target.value)}
								onPressEnter={handleSearchByUid}
								size="large"
								prefix={
									<SearchOutlined className="text-gray-400" />
								}
								className="rounded-lg"
								style={{
									fontFamily:
										'ui-monospace, SFMono-Regular, "SF Mono", monospace',
									fontSize: "14px",
								}}
							/>
						</div>
						<Button
							type="primary"
							size="large"
							icon={<SearchOutlined />}
							onClick={handleSearchByUid}
							loading={searchLoading}
							className="px-6 rounded-lg">
							Search
						</Button>
						{(searchUid || searchResult) && (
							<Button
								size="large"
								onClick={clearSearch}
								className="px-4 rounded-lg">
								Clear
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Search Result */}
			{searchResult && (
				<div className="border-t border-gray-100 px-6 py-6">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
									UID
								</p>
								<p className="font-mono text-sm bg-white px-3 py-2 rounded-md border shadow-sm">
									{searchResult.pid}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
									Name
								</p>
								<p className="font-semibold text-gray-900 text-base">
									{searchResult.name}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
									Email
								</p>
								<p className="text-gray-700">
									{searchResult.email}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
									Status
								</p>
								<Tag
									color={
										searchResult.isActive ? "green" : "red"
									}
									icon={
										searchResult.isActive ? (
											<CheckCircleOutlined />
										) : (
											<CloseCircleOutlined />
										)
									}
									className="text-sm">
									{searchResult.isActive
										? "Active"
										: "Inactive"}
								</Tag>
							</div>
						</div>
						<div className="mt-5 pt-4 border-t border-blue-200 flex gap-3">
							<Button
								type="primary"
								icon={<EditOutlined />}
								onClick={() => handleEdit(searchResult)}
								className="rounded-lg">
								Edit User
							</Button>
							<Popconfirm
								title="Delete User"
								description="Are you sure you want to delete this user?"
								onConfirm={() => handleDelete(searchResult.id)}
								okText="Yes"
								cancelText="No">
								<Button
									danger
									icon={<DeleteOutlined />}
									className="rounded-lg">
									Delete User
								</Button>
							</Popconfirm>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default UserSearch;
