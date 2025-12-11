import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, HomeOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const PublisherList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);

  // --- MOCK DATA ---
  const [data, setData] = useState([
    {
      id: 'p1111111-aaaa-bbbb-cccc-111122223333',
      name: 'NXB Kim Đồng',
      code: 'NXB_KD',
      address: '55 Quang Trung, Hà Nội',
      status: 'ACTIVE',
    },
    {
      id: 'p2222222-aaaa-bbbb-cccc-111122223333',
      name: 'NXB Trẻ',
      code: 'NXB_TRE',
      address: '161B Lý Chính Thắng, TP.HCM',
      status: 'ACTIVE',
    }
  ]);

  // --- HÀM XỬ LÝ ---
  const handleAddNew = () => {
    setEditingPublisher(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPublisher(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa Nhà xuất bản?',
      content: 'Lưu ý: Không nên xóa nếu NXB này đang có sách trong hệ thống.',
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
      if (editingPublisher) {
        const newData = data.map(item => item.id === editingPublisher.id ? { ...item, ...values } : item);
        setData(newData);
        message.success('Cập nhật NXB thành công!');
      } else {
        const newItem = { ...values, id: Date.now().toString(), status: 'ACTIVE' };
        setData([newItem, ...data]);
        message.success('Thêm NXB mới thành công!');
      }
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'Mã NXB',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Tên Nhà xuất bản',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <b style={{ color: '#1677ff' }}>{text}</b>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
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
        <Breadcrumb.Item>Nhà xuất bản</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm NXB..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Nhà xuất bản
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 6 }} />

      <Modal
        title={editingPublisher ? "Cập nhật NXB" : "Thêm NXB mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên Nhà xuất bản" rules={[{ required: true }]}>
            <Input prefix={<HomeOutlined />} placeholder="Nhập tên NXB..." />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true }]}>
                <Input placeholder="VD: NXB_KD" style={{ textTransform: 'uppercase' }} />
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

          <Form.Item name="address" label="Địa chỉ">
            <TextArea rows={2} placeholder="Nhập địa chỉ trụ sở..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPublisher ? "Lưu lại" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PublisherList;