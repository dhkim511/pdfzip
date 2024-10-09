export const SERVER_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_SERVER_URL;
