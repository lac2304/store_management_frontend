import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col, Card 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Option } = Select;

const CategoryList = () => {
  const [form] = Form.useForm();
  
  // --- STATE QUẢN LÝ ---
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // --- DỮ LIỆU MOCK (Khớp với SQL mẫu của bạn) ---
  const [data, setData] = useState([
    {
      id: 'c1a1bde7-6a4a-4d21-a71d-f2c1a1111111',
      key: '1',
      categoryName: 'Tiểu thuyết',
      categoryCode: 'NOVEL',
      status: 'ACTIVE',
      bookCount: 150 // Giả lập số lượng sách trong danh mục
    },
    {
      id: 'c2a1bde7-6a4a-4d21-a71d-f2c1a2222222',
      key: '2',
      categoryName: 'Khoa học',
      categoryCode: 'SCI',
      status: 'ACTIVE',
      bookCount: 45
    },
    {
      id: 'c3a1bde7-6a4a-4d21-a71d-f2c1a3333333',
      key: '3',
      categoryName: 'Kinh tế',
      categoryCode: 'ECO',
      status: 'ACTIVE',
      bookCount: 80
    },
    {
      id: 'c4a1bde7-6a4a-4d21-a71d-f2c1a4444444',
      key: '4',
      categoryName: 'Truyện Tranh (Manga)',
      categoryCode: 'MANGA',
      status: 'INACTIVE',
      bookCount: 0
    }
  ]);

  // --- HÀM MỞ MODAL THÊM MỚI ---
  const handleAddNew = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- HÀM MỞ MODAL SỬA ---
  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa danh mục?',
      content: 'Lưu ý: Nếu danh mục này đang có sách, bạn không nên xóa nó.',
      okType: 'danger',
      onOk() {
        // Gọi API xóa thật ở đây
        message.success('Đã xóa thành công');
        setData(data.filter(item => item.id !== id));
      },
    });
  };

  // --- SUBMIT FORM ---
  const onFinish = (values) => {
    setLoading(true);
    // Giả lập API delay
    setTimeout(() => {
      if (editingCategory) {
        // Update logic
        const newData = data.map(item => 
          item.id === editingCategory.id ? { ...item, ...values } : item
        );
        setData(newData);
        message.success('Cập nhật danh mục thành công!');
      } else {
        // Create logic
        const newCategory = {
          ...values,
          id: `new_${Date.now()}`,
          key: `${Date.now()}`,
          bookCount: 0
        };
        setData([newCategory, ...data]);
        message.success('Thêm danh mục mới thành công!');
      }
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: 'Mã Thể Loại',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      render: (text) => <Tag color="geekblue">{text}</Tag>
    },
    {
      title: 'Tên Thể Loại',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Số đầu sách',
      dataIndex: 'bookCount',
      key: 'bookCount',
      render: (count) => `${count} cuốn`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ẩn'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Danh mục Thể loại</Breadcrumb.Item>
      </Breadcrumb>

      {/* Toolbar */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Tìm kiếm danh mục..." 
          style={{ width: 300 }} 
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm danh mục
        </Button>
      </div>

      {/* Table */}
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 8 }} 
        rowKey="id"
      />

      {/* Modal Form */}
      <Modal
        title={editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 'ACTIVE' }}
        >
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
                  placeholder="VD: NOVEL, SCI..." 
                  style={{ textTransform: 'uppercase' }} 
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
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCategory ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;