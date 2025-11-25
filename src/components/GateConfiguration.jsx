import { Switch, InputNumber, Button } from "antd";
import { useState } from "react";

function GateConfiguration({ deviceStatus, onModeChange, onThresholdChange }) {
	const [thresholdValue, setThresholdValue] = useState(
		deviceStatus.threshold
	);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleThresholdSubmit = async () => {
		setIsUpdating(true);
		await onThresholdChange(thresholdValue ?? deviceStatus.threshold);
		setTimeout(() => setIsUpdating(false), 500);
	};

	const isAutoMode = deviceStatus.auto_mode === "auto";

	return (
		<div className="bg-white shadow-md p-6 rounded-xl mt-4 h-full border border-gray-100">
			{/* Header */}
			<div className="text-center mb-6">
				<div className="flex items-center justify-center gap-3 mb-2">
					<div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
						<svg
							className="w-4 h-4 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-gray-800">
						Configuration
					</h2>
				</div>
				<p className="text-gray-500 text-sm mb-3">
					Automation settings
				</p>
				<div className="w-12 h-0.5 bg-orange-500 rounded-full mx-auto"></div>
			</div>

			{/* Configuration Options */}
			<div className="space-y-6">
				{/* Auto Mode Section */}
				<div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-lg flex items-center justify-center ${
									isAutoMode
										? "bg-blue-100 text-blue-600"
										: "bg-gray-200 text-gray-500"
								}`}>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<div className="text-left">
								<p className="font-medium text-gray-800">
									Gate Mode
								</p>
								<p className="text-xs text-gray-500">
									Sensor automation
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span
								className={`text-sm font-medium ${
									isAutoMode
										? "text-blue-600"
										: "text-gray-500"
								}`}>
								{isAutoMode ? "Auto" : "Manual"}
							</span>
							<Switch
								size="small"
								checked={isAutoMode}
								onChange={(checked) => {
									const value = checked ? "auto" : "manual";
									onModeChange(value);
								}}
							/>
						</div>
					</div>
				</div>

				{/* Threshold Section */}
				<div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
								/>
							</svg>
						</div>
						<div className="text-left">
							<p className="font-medium text-gray-800">
								Distance Threshold
							</p>
							<p className="text-xs text-gray-500">
								Auto-close trigger distance
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<InputNumber
								size="small"
								suffix="cm"
								min={1}
								max={100}
								className="w-20"
								placeholder={deviceStatus.threshold}
								value={thresholdValue}
								onChange={(value) => setThresholdValue(value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleThresholdSubmit();
									}
								}}
							/>
							<Button
								type="primary"
								size="small"
								loading={isUpdating}
								className="bg-orange-500 hover:bg-orange-600 border-orange-500"
								onClick={handleThresholdSubmit}>
								{isUpdating ? "..." : "Apply"}
							</Button>
						</div>
						<div className="text-right">
							<p className="text-xs text-gray-400">Current</p>
							<p className="text-sm font-medium text-gray-700">
								{deviceStatus.threshold} cm
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GateConfiguration;
