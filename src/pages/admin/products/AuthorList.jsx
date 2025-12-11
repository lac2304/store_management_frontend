import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, UserOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const AuthorList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  // --- MOCK DATA (Khớp SQL) ---
  const [data, setData] = useState([
    {
      id: 'a1b2c3d4-1111-2222-3333-444455556666',
      name: 'Nguyễn Nhật Ánh',
      code: 'AUTH_NNA',
      status: 'ACTIVE',
    },
    {
      id: 'b1b2c3d4-1111-2222-3333-444455556666',
      name: 'Haruki Murakami',
      code: 'AUTH_MRK',
      status: 'ACTIVE',
    },
    {
      id: 'c1b2c3d4-1111-2222-3333-444455556666',
      name: 'Adam Smith',
      code: 'AUTH_ADM',
      status: 'ACTIVE',
    }
  ]);

  // --- HÀM XỬ LÝ (MỞ MODAL, EDIT, DELETE) ---
  const handleAddNew = () => {
    setEditingAuthor(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingAuthor(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa tác giả?',
      content: 'Hành động này không thể hoàn tác.',
      okType: 'danger',
      onOk() {
        message.success('Đã xóa thành công');
        setData(data.filter(item => item.id !== id));
      },
    });
  };

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      if (editingAuthor) {
        // Cập nhật
        const newData = data.map(item => item.id === editingAuthor.id ? { ...item, ...values } : item);
        setData(newData);
        message.success('Cập nhật tác giả thành công!');
      } else {
        // Thêm mới
        const newItem = { ...values, id: Date.now().toString(), status: 'ACTIVE' };
        setData([newItem, ...data]);
        message.success('Thêm tác giả mới thành công!');
      }
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'Mã Tác giả',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Tên Tác giả',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Ẩn'}
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
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Tác giả</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm tên tác giả..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Tác giả
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 6 }} />

      <Modal
        title={editingAuthor ? "Cập nhật Tác giả" : "Thêm Tác giả mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên Tác giả" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Nhập tên..." />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true }]}>
                <Input placeholder="VD: AUTH_01" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
                <Select>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Tạm ẩn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingAuthor ? "Lưu lại" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorList;