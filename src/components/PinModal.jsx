import { useCallback, useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { api } from "../services/api";
import "./PinModal.css";

function PinModal({ open, userId, onCancel, onDeleted }) {
	const [pin, setPin] = useState("");
	const [isShaking, setIsShaking] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef(null);

	useEffect(() => {
		if (open) {
			setPin("");
			setIsShaking(false);
			setLoading(false);
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		} else {
			setPin("");
			setIsShaking(false);
			setLoading(false);
		}
	}, [open]);

	const handleChange = (event) => {
		if (!open || loading) return;
		const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 6);
		setPin(digitsOnly);
	};

	const handleKeyDown = (event) => {
		if (!open || loading) return;
		if (event.key === "Backspace") {
			event.preventDefault();
			setPin((prev) => prev.slice(0, -1));
		}
	};

	const handlePaste = (event) => {
		event.preventDefault();
		if (!open || loading) return;
		const pasted = event.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, 6);
		setPin(pasted);
	};

	const submitPin = useCallback(
		async (currentPin) => {
			if (!userId) return;

			setLoading(true);
			try {
				const response = await api.delete(`/users/${userId}`, {
					data: { pin: currentPin },
					validateStatus: (status) =>
						status === 200 || status === 401,
				});

				if (response.status === 200) {
					message.success("berhasil hapus user");
					onDeleted?.(userId);
					onCancel?.();
					return;
				}

				if (response.status === 401) {
					message.error("gagal hapus user");
					setIsShaking(true);
					setTimeout(() => {
						setIsShaking(false);
						setPin("");
						inputRef.current?.focus();
					}, 420);
					return;
				}
			} catch (error) {
				const serverMessage =
					error.response?.data?.message || "Gagal menghapus user";
				message.error(serverMessage);
			} finally {
				setLoading(false);
			}
		},
		[userId, onDeleted, onCancel]
	);

	useEffect(() => {
		if (pin.length === 6 && open && userId) {
			submitPin(pin);
		}
	}, [pin, open, userId, submitPin]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
			<div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl p-6">
				<div className="text-center mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
						Konfirmasi Delete User
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						Masukkan PIN 6 digit untuk menghapus user.
					</p>
				</div>

				<div className="flex justify-center">
					<div
						className={`flex items-center gap-3 ${
							isShaking ? "isShaking" : ""
						}`}>
						{Array.from({ length: 6 }).map((_, index) => (
							<span
								key={index}
								className={`h-5 w-5 rounded-full border transition-all duration-200 ${
									index < pin.length
										? "bg-blue-600 border-blue-600"
										: "border-gray-300"
								}`}
							/>
						))}
					</div>
				</div>

				<input
					ref={inputRef}
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					autoComplete="one-time-code"
					className="pin-hidden-input"
					value={pin}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
					maxLength={6}
					disabled={loading}
				/>

				<div className="mt-8 flex justify-center">
					<Button
						onClick={onCancel}
						disabled={loading}
						className="rounded-lg px-6">
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}

export default PinModal;
