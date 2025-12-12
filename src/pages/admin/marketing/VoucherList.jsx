import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, DatePicker, InputNumber, Switch, Row, Col, Card, Radio, Select 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, GiftOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const VoucherList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  
  // State quản lý loại phạm vi (để ẩn hiện ô chọn)
  const [targetScope, setTargetScope] = useState('ALL'); 

  // --- MOCK DATA HỖ TRỢ CHỌN TARGET ---
  const mockCategories = [
    { id: 'c1', name: 'Tiểu thuyết' },
    { id: 'c2', name: 'Kinh tế' },
    { id: 'c3', name: 'Khoa học' },
  ];
  const mockBooks = [
    { id: 'b1', name: 'Mắt Biếc' },
    { id: 'b2', name: 'Rừng Na Uy' },
    { id: 'b3', name: 'Đắc Nhân Tâm' },
  ];

  // --- MOCK DATA VOUCHERS ---
  const [data, setData] = useState([
    {
      id: 'v1',
      name: 'Sale Tiểu Thuyết',
      code: 'NOVEL20',
      discountValue: 20, 
      type: 'PERCENTAGE',
      scope: 'CATEGORY', // Trường tự quy định để UI dễ xử lý
      targets: ['c1'],   // List ID danh mục áp dụng
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      isActive: true,
    }
  ]);

  // --- ACTIONS ---
  const handleAddNew = () => {
    setEditingVoucher(null);
    setTargetScope('ALL'); // Mặc định là toàn shop
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingVoucher(record);
    setTargetScope(record.scope || 'ALL'); // Cập nhật state scope để UI hiển thị đúng
    
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)]
    });
    setIsModalOpen(true);
  };
  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa mã giảm giá?',
      content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?',
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk() {
        // 1. Xóa trên giao diện (Mock data)
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        
        // 2. Gọi API xóa (Sau này bỏ comment dòng dưới)
        // axiosClient.delete(`/vouchers/${id}`);
        
        message.success('Đã xóa voucher thành công');
      },
      onCancel() {
        console.log('Đã hủy xóa');
      },
    });
  };

  const onFinish = (values) => {
    const startDate = values.dateRange[0].format('YYYY-MM-DD');
    const endDate = values.dateRange[1].format('YYYY-MM-DD');
    
    // Logic xử lý Target
    let finalTargets = [];
    if (values.scope === 'CATEGORY') {
       finalTargets = values.selectedCategories; // Array ID danh mục
    } else if (values.scope === 'PRODUCT') {
       finalTargets = values.selectedProducts;   // Array ID sách
    }

    const voucherData = {
      ...values,
      startDate,
      endDate,
      targets: finalTargets, // Lưu cái này xuống DB bảng VoucherTargets
      dateRange: undefined 
    };

    if (editingVoucher) {
      const newData = data.map(item => item.id === editingVoucher.id ? { ...item, ...voucherData } : item);
      setData(newData);
      message.success('Cập nhật thành công!');
    } else {
      setData([...data, { ...voucherData, id: Date.now().toString(), usageCount: 0 }]);
      message.success('Tạo mới thành công!');
    }
    setIsModalOpen(false);
  };

  // --- COLUMNS ---
  // --- COLUMNS (Đã bổ sung nút Xóa) ---
  const columns = [
    { title: 'Mã Code', dataIndex: 'code', render: t => <Tag color="blue">{t}</Tag> },
    { title: 'Tên Voucher', dataIndex: 'name', render: t => <b>{t}</b> },
    { 
      title: 'Phạm vi', 
      dataIndex: 'scope',
      render: (scope) => {
        if(scope === 'CATEGORY') return <Tag color="cyan">Theo Danh mục</Tag>;
        if(scope === 'PRODUCT') return <Tag color="purple">Theo Sản phẩm</Tag>;
        return <Tag color="gold">Toàn bộ đơn</Tag>;
      }
    },
    { 
      title: 'Giảm', 
      render: (_, r) => <b style={{color:'green'}}>{r.discountValue}{r.type === 'PERCENTAGE' ? '%' : 'đ'}</b> 
    },
    { title: 'Thời gian', render: (_, r) => <span style={{fontSize:12}}>{r.startDate} - {r.endDate}</span> },
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
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Marketing' }, { title: 'Voucher' }]} />
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Tạo Voucher</Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

      {/* --- MODAL FORM --- */}
      <Modal
        title={editingVoucher ? "Cập nhật Voucher" : "Tạo Voucher Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true, type: 'PERCENTAGE', scope: 'ALL' }}>
          
          {/* 1. THÔNG TIN CƠ BẢN */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên chương trình" rules={[{ required: true }]}>
                <Input placeholder="VD: Siêu sale 12.12" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Mã Code" rules={[{ required: true }]}>
                <Input style={{ textTransform: 'uppercase' }} placeholder="VD: SALE1212" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dateRange" label="Thời gian áp dụng" rules={[{ required: true }]}>
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
                 <Switch />
               </Form.Item>
            </Col>
          </Row>

          {/* 2. THIẾT LẬP GIẢM GIÁ */}
          <Card size="small" title="Giá trị giảm" style={{ marginBottom: 16, background: '#f5f5f5' }}>
             <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="type" label="Loại giảm">
                    <Select>
                      <Option value="PERCENTAGE">Theo %</Option>
                      <Option value="FIXED_AMOUNT">Số tiền cố định</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="discountValue" label="Mức giảm" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="minOrderValue" label="Đơn tối thiểu">
                     <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </Form.Item>
                </Col>
             </Row>
          </Card>

          {/* 3. CẤU HÌNH PHẠM VI (TARGET) - PHẦN QUAN TRỌNG NHẤT */}
          <Card size="small" title="Phạm vi áp dụng (Voucher Target)" style={{ border: '1px solid #1677ff' }}>
             
             {/* Radio chọn loại phạm vi */}
             <Form.Item name="scope" style={{ marginBottom: 10 }}>
                <Radio.Group onChange={(e) => setTargetScope(e.target.value)} buttonStyle="solid">
                   <Radio.Button value="ALL">Toàn bộ đơn hàng</Radio.Button>
                   <Radio.Button value="CATEGORY">Theo danh mục</Radio.Button>
                   <Radio.Button value="PRODUCT">Theo sản phẩm (Sách)</Radio.Button>
                </Radio.Group>
             </Form.Item>

             {/* Hiện ô chọn Danh mục nếu scope = CATEGORY */}
             {targetScope === 'CATEGORY' && (
                <Form.Item 
                  name="selectedCategories" 
                  label="Chọn danh mục áp dụng" 
                  rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 danh mục!' }]}
                >
                   <Select mode="multiple" placeholder="Chọn các danh mục...">
                      {mockCategories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                   </Select>
                </Form.Item>
             )}

             {/* Hiện ô chọn Sách nếu scope = PRODUCT */}
             {targetScope === 'PRODUCT' && (
                <Form.Item 
                  name="selectedProducts" 
                  label="Chọn sách áp dụng" 
                  rules={[{ required: true, message: 'Vui lòng chọn sách!' }]}
                >
                   <Select mode="multiple" placeholder="Gõ tên sách để tìm..." showSearch optionFilterProp="children">
                      {mockBooks.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
                   </Select>
                </Form.Item>
             )}

             {targetScope === 'ALL' && (
                <div style={{ color: '#888', fontStyle: 'italic' }}>
                   * Mã giảm giá sẽ áp dụng cho tổng giá trị đơn hàng, không phân biệt sản phẩm.
                </div>
             )}
          </Card>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
             <Space>
               <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
               <Button type="primary" htmlType="submit">Lưu Voucher</Button>
             </Space>
          </div>

        </Form>
      </Modal>
    </div>
  );
};

export default VoucherList;