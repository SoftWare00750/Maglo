/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose environment variables to middleware
  env: {
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  },
};

module.exports = nextConfig;