import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, AppstoreOutlined 
} from '@ant-design/icons';
import categoryApi from '../../../api/products/categoryApi'; // Import API

const { Option } = Select;

const CategoryList = () => {
  const [form] = Form.useForm();
  
  // State quản lý
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // =================================================================
  // 1. HÀM GỌI API (Logic tìm mảng thông minh)
  // =================================================================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      console.log("🔍 API Category:", response); 

      let validData = [];
      // Kiểm tra mọi trường hợp API trả về
      if (Array.isArray(response)) validData = response;
      else if (response?.data && Array.isArray(response.data)) validData = response.data;
      else if (response?.result && Array.isArray(response.result)) validData = response.result;
      else if (response?.data?.items && Array.isArray(response.data.items)) validData = response.data.items;

      setData(validData);

    } catch (error) {
      console.error("Lỗi fetch:", error);
      message.error('Không thể tải danh sách thể loại!');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =================================================================
  // 2. HÀM SUBMIT (Mapping PascalCase cho .NET)
  // =================================================================
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ép kiểu dữ liệu sang PascalCase (Khớp với SQL/Entity)
      const payload = {
        CategoryName: values.categoryName,
        CategoryCode: values.categoryCode,
        Status: values.status,
        IsDeleted: false
      };

      if (editingCategory) {
        // --- UPDATE ---
        payload.Id = editingCategory.id; // Gắn ID vào
        console.log("📤 Update payload:", payload);
        await categoryApi.update(editingCategory.id, payload);
        message.success('Cập nhật thành công!');
      } else {
        // --- CREATE ---
        // Không gửi ID để Backend tự sinh GUID
        console.log("📤 Create payload:", payload);
        await categoryApi.create(payload);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchCategories(); // Tải lại bảng

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
      title: 'Xóa danh mục?',
      content: 'Lưu ý: Nếu danh mục này đang có sách, bạn không nên xóa nó.',
      okType: 'danger',
      okText: 'Xóa ngay',
      onOk: async () => {
        try {
          await categoryApi.delete(id);
          message.success('Đã xóa thành công');
          fetchCategories();
        } catch (error) {
          message.error('Xóa thất bại (Có thể do dữ liệu ràng buộc).');
        }
      }
    });
  };

  // --- CÁC HÀM PHỤ TRỢ ---
  const handleAddNew = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    // Map dữ liệu từ bảng (PascalCase) vào Form (camelCase)
    form.setFieldsValue({
      categoryName: record.categoryName || record.CategoryName,
      categoryCode: record.categoryCode || record.CategoryCode,
      status: record.status || record.Status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'Mã Thể Loại',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      render: (text, r) => <Tag color="geekblue">{text || r.CategoryCode}</Tag>
    },
    {
      title: 'Tên Thể Loại',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text, r) => <b>{text || r.CategoryName}</b>,
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
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Sản phẩm' }, { title: 'Danh mục' }]} />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm danh mục..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Danh mục
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(record) => record.id || record.Id} 
        loading={loading}
        pagination={{ pageSize: 8 }} 
      />

      <Modal
        title={editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden={true} // Reset form khi đóng
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'ACTIVE' }}>
          <Form.Item 
            name="categoryName" 
            label="Tên Thể Loại" 
            rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
          >
            <Input placeholder="Ví dụ: Tiểu thuyết, Kinh tế..." prefix={<AppstoreOutlined />} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryCode"
                label="Mã Code (Viết tắt)"
                rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
              >
                <Input 
                  placeholder="VD: NOVEL" 
                  style={{ textTransform: 'uppercase' }} 
                  // Tự động viết hoa khi nhập
                  onChange={(e) => form.setFieldsValue({ categoryCode: e.target.value.toUpperCase() })}
                />
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

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCategory ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;