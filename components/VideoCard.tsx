"use client";
import { useState, useEffect } from "react";

export default function VideoCard() {
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

	const handleFileChange = (event) => {
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
		<div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
			<h1>Видео Облако</h1>
			<input type="file" accept="video/*" onChange={handleFileChange} />
			<button onClick={handleUpload} style={{ marginTop: "10px" }}>
				Загрузить
			</button>

			<h2>Загруженные видео:</h2>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "10px",
					justifyContent: "center",
				}}
			>
				{videos.map((video, index) => (
					<video key={index} controls width="300">
						<source src={video} type="video/mp4" />
					</video>
				))}
			</div>
		</div>
	);
}
