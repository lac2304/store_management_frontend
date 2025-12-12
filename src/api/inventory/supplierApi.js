import axiosClient from '../axiosClient';

const supplierApi = {
  // 1. Lấy danh sách
  getAll: () => {
    return axiosClient.get('/suppliers');
  },

  // 2. Thêm mới
  create: (data) => {
    return axiosClient.post('/suppliers', data);
  },

  // 3. Cập nhật
  update: (id, data) => {
    return axiosClient.put(`/suppliers/${id}`, data);
  },

  // 4. Xóa
  delete: (id) => {
    return axiosClient.delete(`/suppliers/${id}`);
  }
};

export default supplierApi;