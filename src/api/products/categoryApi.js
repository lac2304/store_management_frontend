import axiosClient from '../axiosClient';

const categoryApi = {
  // 1. Lấy danh sách
  getAll: () => {
    return axiosClient.get('/categories'); 
  },

  // 2. Thêm mới
  create: (data) => {
    return axiosClient.post('/categories', data);
  },

  // 3. Cập nhật
  update: (id, data) => {
    return axiosClient.put(`/categories/${id}`, data);
  },

  // 4. Xóa
  delete: (id) => {
    return axiosClient.delete(`/categories/${id}`);
  }
};

export default categoryApi;