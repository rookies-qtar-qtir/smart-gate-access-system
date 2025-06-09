import { Table } from "antd";

function ActivityLog({ mqttLogs }) {
	const columns = [
		{ title: "Time", dataIndex: "time", key: "time", width: 180 },
		{ title: "Action", dataIndex: "action", key: "action", width: 100 },
		{ title: "Topic", dataIndex: "topic", key: "topic", width: 200 },
		{ title: "Message", dataIndex: "message", key: "message" },
	];

	return (
		<section className="bg-white shadow-md p-6 rounded-xl mt-4 border border-gray-100 text-left">
			{/* Header */}
			<div className="mb-4 flex items-center gap-3">
				<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
					<svg
						className="w-4 h-4 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 className="font-bold text-xl text-gray-800">All Logs</h2>
			</div>

			<div className="w-12 h-0.5 bg-blue-500 rounded-full mb-4"></div>

			<Table
				dataSource={mqttLogs}
				columns={columns}
				rowKey={(record, i) => i}
				pagination={{ pageSize: 10 }}
			/>
		</section>
	);
}

export default ActivityLog;
