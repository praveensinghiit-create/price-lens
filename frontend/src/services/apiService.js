import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  searchGoogle: (params) => apiClient.post("/search", params),
  getProductDetails: (asin) => apiClient.get(`/product/${asin}`),
  healthCheck: () => apiClient.get("/health"),
  sendMessage: (data) => apiClient.post("/chat", data),
};

export default apiService;