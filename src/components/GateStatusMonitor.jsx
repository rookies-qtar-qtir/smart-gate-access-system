import { Col, Row } from "antd";
import { useState, useEffect } from "react";
import DistanceBar from "./DistanceBar";

function GateStatusMonitor({ deviceStatus }) {
	const [isAnimating, setIsAnimating] = useState(false);
	const isOpen = deviceStatus?.servo === "1";

	useEffect(() => {
		setIsAnimating(true);
		const timer = setTimeout(() => setIsAnimating(false), 300);
		return () => clearTimeout(timer);
	}, [deviceStatus?.servo]);

	return (
		<section className="bg-white shadow-md p-6 rounded-xl mt-4 border border-gray-100">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
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
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h2 className="font-bold text-xl text-gray-800">
						Gate Status Monitor
					</h2>
				</div>
				<div className="w-12 h-0.5 bg-blue-500 rounded-full"></div>
			</div>

			<Row gutter={20}>
				<Col span={12}>
					<div className="bg-gray-50 rounded-lg p-6 h-full hover:bg-gray-100 transition-colors duration-200">
						<div className="flex items-center justify-between mb-3">
							<p className="text-gray-600 font-medium">
								Gate Status
							</p>
							<div
								className={`w-2 h-2 rounded-full ${
									isOpen ? "bg-green-400" : "bg-red-400"
								} ${isAnimating ? "animate-pulse" : ""}`}></div>
						</div>

						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-lg flex items-center justify-center ${
									isOpen
										? "bg-green-100 text-green-600"
										: "bg-red-100 text-red-600"
								}`}>
								{isOpen ? (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
										/>
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								)}
							</div>
							<div className="text-left">
								<span
									className={`font-bold text-xl ${
										isOpen
											? "text-green-600"
											: "text-red-600"
									}`}>
									{isOpen ? "Open" : "Closed"}
								</span>
								<p className="text-sm text-gray-500 mt-1">
									{isOpen ? "Gate is open" : "Gate is closed"}
								</p>
							</div>
						</div>
					</div>
				</Col>

				<Col span={12}>
					<div className="bg-gray-50 rounded-lg p-6 h-full hover:bg-gray-100 transition-colors duration-200">
						<div className="flex items-center justify-between mb-3">
							<p className="text-gray-600 font-medium">
								Distance Sensor
							</p>
							<div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
						</div>

						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
								<svg
									className="w-5 h-5"
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
							<p className="text-sm text-gray-500">
								Real-time measurement
							</p>
						</div>

						<DistanceBar />
					</div>
				</Col>
			</Row>
		</section>
	);
}

export default GateStatusMonitor;
