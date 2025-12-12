// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   pwa: {
//     // custom options if needed
//   },
// });

const nextConfig = {
  rewrites: async () => [
    { source: "/((?!api/).*)", destination: "/static-app-shell" },
  ],
  // other Next.js config...
};

export default nextConfig;
