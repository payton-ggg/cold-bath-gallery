import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
	api: {
		bodyParser: false,
	},
};

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

export default function handler(req, res) {
	if (req.method === "GET") {
		const files = fs.readdirSync(uploadDir).map((file) => `/uploads/${file}`);
		return res.status(200).json({ videos: files });
	}

	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const form = new formidable.IncomingForm();
	form.uploadDir = uploadDir;
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(500).json({ message: "Error parsing the files" });
		}
		const oldPath = files.file.filepath;
		const newPath = path.join(uploadDir, files.file.originalFilename);
		fs.renameSync(oldPath, newPath);

		const filePath = `/uploads/${files.file.originalFilename}`;
		res.status(200).json({ filePath });
	});
}
