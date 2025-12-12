import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, HomeOutlined 
} from '@ant-design/icons';
import publisherApi from '../../../api/products/publisherApi'; // Import API vừa tạo

const { Option } = Select;
const { TextArea } = Input;

const PublisherList = () => {
  const [form] = Form.useForm();
  
  // State quản lý
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);

  // =================================================================
  // 1. HÀM GỌI API (Tự động xử lý cấu trúc dữ liệu)
  // =================================================================
  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await publisherApi.getAll();
      console.log("🔍 API Publisher:", response); 

      let validData = [];

      // TRƯỜNG HỢP 1: API trả về mảng trực tiếp [item1, item2]
      if (Array.isArray(response)) {
        validData = response;
      } 
      // TRƯỜNG HỢP 2: API trả về { data: [item1, item2] }
      else if (response?.data && Array.isArray(response.data)) {
        validData = response.data;
      }
      // TRƯỜNG HỢP 3: API trả về { data: { items: [...] } } <--- KHẢ NĂNG CAO LÀ CÁI NÀY
      else if (response?.data?.items && Array.isArray(response.data.items)) {
        validData = response.data.items;
      }
      // TRƯỜNG HỢP 4: API trả về { data: { result: [...] } }
      else if (response?.data?.result && Array.isArray(response.data.result)) {
        validData = response.data.result;
      }
      // TRƯỜNG HỢP 5: API trả về { result: [...] }
      else if (response?.result && Array.isArray(response.result)) {
        validData = response.result;
      }

      setData(validData);

    } catch (error) {
      console.error("Lỗi fetch:", error);
      message.error('Không thể tải danh sách NXB!');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  // =================================================================
  // 2. HÀM SUBMIT (Mapping PascalCase cho .NET)
  // =================================================================
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ép kiểu dữ liệu sang PascalCase (Viết Hoa Chữ Đầu)
      const payload = {
        Name: values.name,
        Code: values.code,
        Address: values.address,
        Status: values.status,
        IsDeleted: false
      };

      if (editingPublisher) {
        // --- UPDATE ---
        payload.Id = editingPublisher.id; // Gắn ID vào
        console.log("📤 Update payload:", payload);
        await publisherApi.update(editingPublisher.id, payload);
        message.success('Cập nhật thành công!');
      } else {
        // --- CREATE ---
        // Không gửi ID để Backend tự sinh GUID
        console.log("📤 Create payload:", payload);
        await publisherApi.create(payload);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchPublishers(); // Tải lại bảng

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
      title: 'Xóa Nhà xuất bản?',
      content: 'Lưu ý: Không nên xóa nếu NXB này đang có sách.',
      okType: 'danger',
      okText: 'Xóa ngay',
      onOk: async () => {
        try {
          await publisherApi.delete(id);
          message.success('Đã xóa thành công');
          fetchPublishers();
        } catch (error) {
          message.error('Xóa thất bại (Có thể do dữ liệu ràng buộc).');
        }
      }
    });
  };

  // --- CÁC HÀM PHỤ TRỢ ---
  const handleAddNew = () => {
    setEditingPublisher(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPublisher(record);
    // Map dữ liệu từ bảng (có thể là PascalCase) vào Form (camelCase)
    form.setFieldsValue({
      name: record.name || record.Name,
      code: record.code || record.Code,
      address: record.address || record.Address,
      status: record.status || record.Status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'Mã NXB',
      dataIndex: 'code',
      key: 'code',
      render: (text, r) => <Tag color="purple">{text || r.Code}</Tag>
    },
    {
      title: 'Tên Nhà xuất bản',
      dataIndex: 'name',
      key: 'name',
      render: (text, r) => <b style={{ color: '#1677ff' }}>{text || r.Name}</b>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, r) => text || r.Address
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
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Sản phẩm' }, { title: 'Nhà xuất bản' }]} />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm NXB..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Nhà xuất bản
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
        title={editingPublisher ? "Cập nhật NXB" : "Thêm NXB mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden={true}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'ACTIVE' }}>
          <Form.Item name="name" label="Tên Nhà xuất bản" rules={[{ required: true, message: 'Nhập tên NXB' }]}>
            <Input prefix={<HomeOutlined />} placeholder="Ví dụ: NXB Kim Đồng" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true, message: 'Nhập mã' }]}>
                <Input placeholder="VD: NXB_KD" style={{ textTransform: 'uppercase' }} />
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

          <Form.Item name="address" label="Địa chỉ">
            <TextArea rows={2} placeholder="Nhập địa chỉ trụ sở..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingPublisher ? "Lưu lại" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PublisherList;