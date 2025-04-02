import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	api: {
		bodyParser: {
			sizeLimit: "300mb",
		},
	},
};

export default nextConfig;
