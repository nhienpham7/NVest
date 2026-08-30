import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    ...({
        eslint: {
            ignoreDuringBuilds: true,
        },
    } as Record<string, unknown>),
};

export default nextConfig;