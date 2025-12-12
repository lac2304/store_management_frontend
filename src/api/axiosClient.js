import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5254/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor để xử lý dữ liệu trả về cho gọn
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu BE trả về object { data: [...] }, ta lấy luôn phần data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi chung (VD: In ra console)
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;