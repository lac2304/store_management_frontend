import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, UserOutlined 
} from '@ant-design/icons';
import authorApi from '../../../api/products/authorApi'; // Import API vừa tạo

const { Option } = Select;

const AuthorList = () => {
  const [form] = Form.useForm();
  
  // State quản lý
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  // =================================================================
  // 1. HÀM GỌI API (Logic tìm mảng thông minh)
  // =================================================================
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await authorApi.getAll();
      console.log("🔍 API Author:", response); 

      let validData = [];
      // Kiểm tra mọi ngóc ngách để tìm mảng
      if (Array.isArray(response)) validData = response;
      else if (response?.data && Array.isArray(response.data)) validData = response.data;
      else if (response?.result && Array.isArray(response.result)) validData = response.result;
      else if (response?.data?.items && Array.isArray(response.data.items)) validData = response.data.items;

      setData(validData);

    } catch (error) {
      console.error("Lỗi fetch:", error);
      message.error('Không thể tải danh sách tác giả!');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // =================================================================
  // 2. HÀM SUBMIT (Mapping PascalCase cho .NET)
  // =================================================================
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ép kiểu dữ liệu sang PascalCase
      const payload = {
        Name: values.name,
        Code: values.code,
        Status: values.status,
        IsDeleted: false
      };

      if (editingAuthor) {
        // --- UPDATE ---
        payload.Id = editingAuthor.id; // Gắn ID vào để update
        console.log("📤 Update payload:", payload);
        await authorApi.update(editingAuthor.id, payload);
        message.success('Cập nhật thành công!');
      } else {
        // --- CREATE ---
        // Không gửi ID để Backend tự sinh GUID
        console.log("📤 Create payload:", payload);
        await authorApi.create(payload);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchAuthors(); // Tải lại bảng

    } catch (error) {
      console.error("❌ Lỗi API:", error);
      const msg = error.response?.data?.message || 'Lỗi Server (500)';
      message.error(`Thất bại: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // 3. HÀM XÓA
  // =================================================================
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa tác giả?',
      content: 'Hành động này không thể hoàn tác.',
      okType: 'danger',
      okText: 'Xóa ngay',
      onOk: async () => {
        try {
          await authorApi.delete(id);
          message.success('Đã xóa thành công');
          fetchAuthors();
        } catch (error) {
          message.error('Xóa thất bại (Có thể do dữ liệu ràng buộc).');
        }
      }
    });
  };

  // --- CÁC HÀM PHỤ TRỢ ---
  const handleAddNew = () => {
    setEditingAuthor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingAuthor(record);
    // Map dữ liệu từ bảng vào Form
    form.setFieldsValue({
      name: record.name || record.Name,
      code: record.code || record.Code,
      status: record.status || record.Status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'Mã Tác giả',
      dataIndex: 'code',
      key: 'code',
      render: (text, r) => <Tag color="blue">{text || r.Code}</Tag>
    },
    {
      title: 'Tên Tác giả',
      dataIndex: 'name',
      key: 'name',
      render: (text, r) => <b>{text || r.Name}</b>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, r) => {
        const s = status || r.Status;
        return (
          <Tag color={s === 'ACTIVE' ? 'green' : 'default'}>
            {s === 'ACTIVE' ? 'Hoạt động' : 'Ẩn'}
          </Tag>
        )
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id || record.Id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Sản phẩm' }, { title: 'Tác giả' }]} />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm tên tác giả..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Tác giả
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(record) => record.id || record.Id} 
        loading={loading}
        pagination={{ pageSize: 6 }} 
      />

      <Modal
        title={editingAuthor ? "Cập nhật Tác giả" : "Thêm Tác giả mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden={true} // Reset form khi đóng
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'ACTIVE' }}>
          <Form.Item name="name" label="Tên Tác giả" rules={[{ required: true, message: 'Nhập tên tác giả' }]}>
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: Nguyễn Nhật Ánh" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true, message: 'Nhập mã' }]}>
                <Input placeholder="VD: AUTH_NNA" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Tạm ẩn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingAuthor ? "Lưu lại" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorList;