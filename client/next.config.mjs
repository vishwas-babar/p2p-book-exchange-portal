/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*"
            }
        ]
    },
    reactStrictMode: false
};


export default nextConfig;
