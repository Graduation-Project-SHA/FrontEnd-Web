// Configuration file for environment variables
const config = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    "http://wiqaya.duckdns.org:3000",
} as const;

export default config;
