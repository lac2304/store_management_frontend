import axiosClient from '../axiosClient';

const authorApi = {
  // 1. Lấy danh sách
  getAll: () => {
    return axiosClient.get('/authors'); 
  },

  // 2. Thêm mới
  create: (data) => {
    return axiosClient.post('/authors', data);
  },

  // 3. Cập nhật
  update: (id, data) => {
    return axiosClient.put(`/authors/${id}`, data);
  },

  // 4. Xóa
  delete: (id) => {
    return axiosClient.delete(`/authors/${id}`);
  }
};

export default authorApi;