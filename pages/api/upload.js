import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

const uploadDir = path.join(process.cwd(), "public/uploads"); // Папка хранения видео

// Создаем папку, если её нет
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
	if (req.method === "GET") {
		const files = fs.readdirSync(uploadDir).map((file) => `/uploads/${file}`);
		return res.status(200).json({ videos: files });
	}

	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const form = new IncomingForm({ uploadDir, keepExtensions: true });

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(500).json({ message: "Ошибка загрузки файла" });
		}

		const oldPath = files.file[0].filepath;
		const newPath = path.join(
			uploadDir,
			files.file[0].originalFilename || `video-${Date.now()}.mp4`
		);

		fs.renameSync(oldPath, newPath);
		const filePath = `/uploads/${path.basename(newPath)}`;

		res.status(200).json({ filePath });
	});
}
