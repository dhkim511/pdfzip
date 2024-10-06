const isDevelopment = import.meta.env.MODE === "development";

export const SERVER_URL = isDevelopment
  ? "http://localhost:8080"
  : import.meta.env.VITE_SERVER_URL;
