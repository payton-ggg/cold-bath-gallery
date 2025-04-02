"use client";
import { useState, useEffect, SetStateAction } from "react";

export default function Home() {
	const [video, setVideo] = useState(null);
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		fetchVideos();
	}, []);

	const fetchVideos = async () => {
		const res = await fetch("/api/upload");
		const data = await res.json();
		setVideos(data.videos);
	};

	const handleFileChange = (event: {
		target: { files: SetStateAction<null>[] };
	}) => {
		setVideo(event.target.files[0]);
	};

	const handleUpload = async () => {
		if (!video) return alert("Выберите файл!");

		const formData = new FormData();
		formData.append("file", video);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (res.ok) {
			fetchVideos();
			setVideo(null);
		}
	};

	return (
		<>
			<div className="w-full flex flex-row flex-wrap gap-5 p-10">
				<div className="flex-1/4 max-h-[500px] max-w-[500px] flex items-center justify-center">
					<input
						type="file"
						accept="video/*"
						className="block w-full text-xl p-3 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
						onChange={handleFileChange}
					/>
					<button
						onClick={handleUpload}
						className="py-2.5 px-5 me-2 ml-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
					>
						Загрузить
					</button>
				</div>
				{videos.map((video, index) => (
					<video key={index} controls className="flex-1/4 max-h-[500px]">
						<source src={video} type="video/mp4" />
					</video>
				))}
			</div>
		</>
	);
}
