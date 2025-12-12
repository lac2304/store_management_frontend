import axiosClient from '../axiosClient';

const publisherApi = {
  // 1. Lấy danh sách
  getAll: () => {
    return axiosClient.get('/publishers'); 
  },

  // 2. Thêm mới
  create: (data) => {
    return axiosClient.post('/publishers', data);
  },

  // 3. Cập nhật
  update: (id, data) => {
    return axiosClient.put(`/publishers/${id}`, data);
  },

  // 4. Xóa
  delete: (id) => {
    return axiosClient.delete(`/publishers/${id}`);
  }
};

export default publisherApi;