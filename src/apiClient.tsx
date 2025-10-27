import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:3000",
  withCredentials: true,
});

//? REQUEST INTERCEPTOR : runs before request sent to servewr

API.interceptors.request.use((configs) => {
  const token = localStorage.getItem("token");
  if (token) {
    configs.headers.Authorization = `Bearer ${token}`;
  }
  return configs;
});

//? RESPONSE INTERCEPTOR : runs after the response is reached

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;