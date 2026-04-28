// Configuration file for environment variables
const config = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    "http://api.wiqaya-app.me",
} as const;

export default config;
