"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import axios, { AxiosError } from "axios";

export default function Home() {
	const [email, setEmail] = useState<string>("");
	const [message, setMessage] = useState<{
		text: string;
		type: "error" | "success";
	} | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!/^\S+@\S+\.\S+$/.test(email)) {
			setMessage({ text: "Please enter a valid email.", type: "error" });
			return;
		}

		setLoading(true);

		try {
			const response = await axios.delete(
				`https://tipmyticket.codevibestudios.com/auth/deleteUser?email=${email}`
			);

			if (response.status === 200) {
				setMessage({
					text: "Your account has been removed!",
					type: "success",
				});
			} else {
				setMessage({
					text: "Something went wrong. Please try again later.",
					type: "error",
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError;

			// Handle 400 error separately
			if (axiosError.response?.status === 400) {
				setMessage({
					text: "Invalid email. Please check and try again.",
					type: "error",
				});
			} else {
				setMessage({
					text: "Something went wrong. Please try again later.",
					type: "error",
				});
			}
			console.error("API Error:", axiosError);
		}

		setEmail("");
		setLoading(false);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
			<div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
					Delete Account
				</h2>
				<p className="text-gray-600 text-center mb-6">
					Enter your email ID to delete your account.
				</p>
				<form onSubmit={handleSubscribe} className="space-y-4">
					<div className="relative">
						<Mail className="absolute left-3 top-2 text-gray-400" />
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 text-black focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
						disabled={loading}
					>
						{loading ? "Removing..." : "Remove Account"}
					</button>
				</form>
				{message && (
					<p
						className={`mt-4 text-center ${
							message.type === "error"
								? "text-red-600"
								: "text-green-600"
						} transition-opacity duration-500`}
					>
						{message.text}
					</p>
				)}
			</div>
		</div>
	);
}
