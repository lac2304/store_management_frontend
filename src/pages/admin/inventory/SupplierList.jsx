// src/pages/admin/inventory/SupplierList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Input, Breadcrumb, Form, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import supplierApi from '../../../api/inventory/supplierApi'; 

const SupplierList = () => {
  const [form] = Form.useForm();
  
  // State quản lý
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // =================================================================
  // 1. HÀM GỌI API (FIX LỖI "raw.some is not a function")
  // =================================================================
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierApi.getAll();
      
      console.log("🔍 API Response:", response); // Debug

      // Logic "thông minh" tìm mảng dữ liệu
      let validData = [];
      if (Array.isArray(response)) {
        validData = response;
      } 
      else if (response?.data && Array.isArray(response.data)) {
        validData = response.data;
      }
      else if (response?.result && Array.isArray(response.result)) {
        validData = response.result;
      }
      else if (response?.data?.items && Array.isArray(response.data.items)) {
        validData = response.data.items;
      }

      // Sắp xếp dữ liệu mới nhất lên đầu (nếu có trường createdAt)
      // Hoặc chỉ cần set data
      setData(validData);

    } catch (error) {
      console.error("Lỗi fetch:", error);
      message.error('Không thể tải danh sách nhà cung cấp!');
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // =================================================================
  // 2. HÀM SUBMIT (FIX LỖI 500 - MAPPING THỦ CÔNG)
  // =================================================================
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 🔥 QUAN TRỌNG: Ép kiểu dữ liệu sang PascalCase để Backend .NET hiểu
      // (Dù Backend chưa cấu hình gì thì gửi kiểu này vẫn ăn 100%)
      const payload = {
        SupplierName: values.supplierName,
        ContactPerson: values.contactPerson,
        Phone: values.phone,
        Address: values.address,
        IsDeleted: false
      };

      if (editingSupplier) {
        // --- UPDATE ---
        // Khi sửa: Gắn thêm ID vào payload
        payload.Id = editingSupplier.id; 
        
        console.log("📤 Gửi đi (Update):", payload);
        await supplierApi.update(editingSupplier.id, payload);
        message.success('Cập nhật thành công!');
      } else {
        // --- CREATE ---
        // Khi tạo mới: TUYỆT ĐỐI KHÔNG gửi ID (để .NET tự sinh GUID)
        
        console.log("📤 Gửi đi (Create):", payload);
        await supplierApi.create(payload);
        message.success('Thêm mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchSuppliers(); // Tải lại bảng

    } catch (error) {
      console.error("❌ Lỗi API:", error);
      // Hiển thị thông báo lỗi chi tiết từ Backend nếu có
      const errorMsg = error.response?.data?.message || error.response?.data?.title || 'Lỗi Server (500)';
      message.error(`Thất bại: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // --- CÁC HÀM PHỤ TRỢ UI ---
  const handleAddNew = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingSupplier(record);
    // Khi đổ dữ liệu vào form, Antd Form dùng name="camelCase"
    // Nên nếu record từ API là PascalCase, ta phải map lại (nhưng thường Antd tự hiểu nếu API trả camelCase)
    // Để chắc chắn, ta set từng trường:
    form.setFieldsValue({
      supplierName: record.supplierName || record.SupplierName,
      contactPerson: record.contactPerson || record.ContactPerson,
      phone: record.phone || record.Phone,
      address: record.address || record.Address
    });
    setIsModalOpen(true);
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    { 
      title: 'Tên Nhà Cung Cấp', 
      dataIndex: 'supplierName', // Thử đọc biến camelCase trước
      key: 'supplierName', 
      render: (text, record) => <b>{text || record.SupplierName}</b> // Fallback sang PascalCase nếu API trả về hoa
    },
    { 
      title: 'Người liên hệ', 
      dataIndex: 'contactPerson', 
      key: 'contactPerson',
      render: (text, record) => text || record.ContactPerson
    },
    { 
      title: 'Số điện thoại', 
      dataIndex: 'phone', 
      key: 'phone',
      render: (text, record) => text || record.Phone
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'address', 
      key: 'address',
      render: (text, record) => text || record.Address
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Kho hàng' }, { title: 'Nhà cung cấp' }]} />
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm nhà cung cấp..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Nhà cung cấp
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(record) => record.id || record.Id} // ID có thể là id hoặc Id
        loading={loading}
      />

      <Modal
        title={editingSupplier ? "Cập nhật NCC" : "Thêm NCC Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="supplierName" label="Tên Nhà Cung Cấp" rules={[{ required: true, message: 'Không được để trống' }]}>
            <Input placeholder="Nhập tên công ty..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contactPerson" label="Người liên hệ">
                <Input prefix={<UserOutlined />} placeholder="Tên người đại diện" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
                <Input prefix={<PhoneOutlined />} placeholder="09xxx..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={2} placeholder="Địa chỉ kho..." />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Lưu lại</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierList;