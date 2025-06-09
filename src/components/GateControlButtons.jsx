import { Button } from "antd";
import { useState } from "react";

function GateControlButtons({ onGateControl }) {
	const [activeButton, setActiveButton] = useState(null);

	const handleGateControl = (action) => {
		setActiveButton(action);
		onGateControl(action);
		setTimeout(() => setActiveButton(null), 200);
	};

	return (
		<div className="bg-white shadow-md p-6 rounded-xl mt-4 h-full border border-gray-100">
			{/* Header */}
			<div className="text-center mb-6">
				<div className="flex items-center justify-center gap-3 mb-2">
					<div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
						<svg
							className="w-4 h-4 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-gray-800">
						Gate Control
					</h2>
				</div>
				<p className="text-gray-500 text-sm mb-3">
					Control the gate status
				</p>
				<div className="w-12 h-0.5 bg-purple-500 rounded-full mx-auto"></div>
			</div>

			{/* Control Buttons */}
			<div className="flex gap-4 justify-center pt-12 scale-160">
				<Button
					size="large"
					className={`flex-1 max-w-[140px] h-12 border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-medium rounded-lg transition-all duration-200 hover:shadow-md ${
						activeButton === "1" ? "scale-95 bg-green-100" : ""
					}`}
					onClick={() => handleGateControl("1")}>
					<div className="flex items-center gap-2">
						<svg
							className="w-4 h-4"
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
						<span>Open</span>
					</div>
				</Button>

				<Button
					size="large"
					className={`flex-1 max-w-[140px] h-12 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 font-medium rounded-lg transition-all duration-200 hover:shadow-md ${
						activeButton === "0" ? "scale-95 bg-red-100" : ""
					}`}
					onClick={() => handleGateControl("0")}>
					<div className="flex items-center gap-2">
						<svg
							className="w-4 h-4"
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
						<span>Close</span>
					</div>
				</Button>
			</div>
		</div>
	);
}

export default GateControlButtons;
