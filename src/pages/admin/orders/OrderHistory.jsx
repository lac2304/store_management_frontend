import React, { useState } from 'react';
import { 
  Table, Tag, Button, Modal, Breadcrumb, DatePicker, 
  Input, Space, Descriptions, Divider 
} from 'antd';
import { SearchOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const OrderHistory = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- MOCK DATA: Danh sách hóa đơn ---
  const [orders] = useState([
    {
      id: 'INV-20251206-001',
      customerName: 'Nguyễn Văn A',
      staffName: 'Nhân viên 1',
      date: '2025-12-06 14:30',
      totalAmount: 215000,
      discount: 15000,
      finalAmount: 200000,
      paymentMethod: 'CASH',
      status: 'PAID'
    },
    {
      id: 'INV-20251206-002',
      customerName: 'Trần Thị B',
      staffName: 'Nhân viên 2',
      date: '2025-12-06 15:45',
      totalAmount: 500000,
      discount: 0,
      finalAmount: 500000,
      paymentMethod: 'BANK_TRANSFER',
      status: 'PENDING'
    }
  ]);

  // --- MOCK DATA: Chi tiết đơn hàng (Thường thì gọi API getDetail) ---
  const [orderDetails, setOrderDetails] = useState([]);

  // Hàm xem chi tiết
  const handleViewDetail = (record) => {
    setSelectedOrder(record);
    // Giả lập dữ liệu chi tiết sách của đơn hàng đó
    setOrderDetails([
      { id: '1', title: 'Mắt Biếc', quantity: 1, price: 95000, total: 95000 },
      { id: '2', title: 'Rừng Na Uy', quantity: 1, price: 120000, total: 120000 },
    ]);
    setIsDetailOpen(true);
  };

  // Cột bảng chính
  const columns = [
    { title: 'Mã Hóa Đơn', dataIndex: 'id', render: t => <b>{t}</b> },
    { title: 'Ngày tạo', dataIndex: 'date' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Nhân viên', dataIndex: 'staffName' },
    { 
      title: 'Thành tiền', 
      dataIndex: 'finalAmount',
      render: v => <span style={{ color: '#1677ff', fontWeight: 'bold' }}>
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)}
      </span>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status',
      render: s => {
        let color = s === 'PAID' ? 'green' : s === 'PENDING' ? 'orange' : 'red';
        return <Tag color={color}>{s}</Tag>;
      }
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>Xem</Button>
      )
    }
  ];

  // Cột bảng chi tiết (Trong Modal)
  const detailColumns = [
    { title: 'Sản phẩm', dataIndex: 'title' },
    { title: 'SL', dataIndex: 'quantity' },
    { 
      title: 'Đơn giá', 
      dataIndex: 'price',
      render: v => new Intl.NumberFormat('vi-VN').format(v)
    },
    { 
      title: 'Thành tiền', 
      dataIndex: 'total',
      render: v => <b>{new Intl.NumberFormat('vi-VN').format(v)}</b>
    }
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Đơn hàng' }, { title: 'Lịch sử' }]} />

      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
        <Input prefix={<SearchOutlined />} placeholder="Mã đơn, tên khách..." style={{ width: 250 }} />
        <Button type="primary">Lọc dữ liệu</Button>
      </div>

      <Table columns={columns} dataSource={orders} rowKey="id" />

      {/* MODAL CHI TIẾT HÓA ĐƠN */}
      <Modal
        title="Chi tiết Đơn hàng"
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        width={700}
        footer={[
          <Button key="print" icon={<PrinterOutlined />}>In hóa đơn</Button>,
          <Button key="close" type="primary" onClick={() => setIsDetailOpen(false)}>Đóng</Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Mã HĐ">{selectedOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Thời gian">{selectedOrder.date}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Thu ngân">{selectedOrder.staffName}</Descriptions.Item>
              <Descriptions.Item label="Thanh toán"><Tag>{selectedOrder.paymentMethod}</Tag></Descriptions.Item>
              <Descriptions.Item label="Trạng thái"><Tag color="green">{selectedOrder.status}</Tag></Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Danh sách sản phẩm</Divider>
            
            <Table 
              columns={detailColumns} 
              dataSource={orderDetails} 
              pagination={false} 
              rowKey="id"
              size="small"
              bordered
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
               <div style={{ width: 250 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span>Tổng tiền hàng:</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(selectedOrder.totalAmount)} đ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, color: 'green' }}>
                    <span>Giảm giá (Voucher):</span>
                    <span>- {new Intl.NumberFormat('vi-VN').format(selectedOrder.discount)} đ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16, borderTop: '1px solid #ddd', paddingTop: 5 }}>
                    <span>Khách phải trả:</span>
                    <span style={{ color: '#cf1322' }}>{new Intl.NumberFormat('vi-VN').format(selectedOrder.finalAmount)} đ</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;