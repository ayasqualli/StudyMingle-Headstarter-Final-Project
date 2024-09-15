/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/letter',
          permanent: false, // Set to false for a temporary redirect
        },
      ]
    },
  }
  
  export default nextConfig;
  