import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, List, Avatar, Typography } from 'antd';
import { 
  DollarCircleOutlined, 
  ShoppingCartOutlined, 
  ReadOutlined, 
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  // Sau này bạn sẽ gọi API ở đây để lấy data thật từ Backend
  const [stats, setStats] = useState({
    revenue: 15400000,
    orders: 125,
    books: 450,
    customers: 89
  });

  const revenueData = [
    { name: 'T2', total: 4000000 },
    { name: 'T3', total: 3000000 },
    { name: 'T4', total: 2000000 },
    { name: 'T5', total: 2780000 },
    { name: 'T6', total: 1890000 },
    { name: 'T7', total: 2390000 },
    { name: 'CN', total: 3490000 },
  ];

  const recentOrders = [
    { key: '1', id: 'INV-001', customer: 'Nguyễn Văn A', total: 200000, status: 'PAID', date: '2025-12-06' },
    { key: '2', id: 'INV-002', customer: 'Trần Thị B', total: 550000, status: 'PENDING', date: '2025-12-06' },
    { key: '3', id: 'INV-003', customer: 'Khách lẻ', total: 120000, status: 'PAID', date: '2025-12-05' },
    { key: '4', id: 'INV-004', customer: 'Lê Văn C', total: 950000, status: 'CANCELLED', date: '2025-12-04' },
    { key: '5', id: 'INV-005', customer: 'Phạm Thị D', total: 300000, status: 'PAID', date: '2025-12-04' },
  ];

  const topSellingBooks = [
    { title: 'Mắt Biếc', sales: 120, percent: 90 },
    { title: 'Rừng Na Uy', sales: 85, percent: 70 },
    { title: 'Nhà Giả Kim', sales: 60, percent: 50 },
    { title: 'Đắc Nhân Tâm', sales: 40, percent: 30 },
  ];

  useEffect(() => {
    // Giả lập loading API
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Format tiền tệ VND
  const formatCurrency = (value) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Cấu hình cột cho bảng đơn hàng
  const columns = [
    { title: 'Mã HĐ', dataIndex: 'id', key: 'id', render: (text) => <b>{text}</b> },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Ngày tạo', dataIndex: 'date', key: 'date' },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'total', 
      key: 'total',
      render: (value) => formatCurrency(value)
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = status === 'PAID' ? 'green' : status === 'PENDING' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
        <RangePicker />
      </div>

      {/* --- 4 THẺ KPI --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic 
              title="Tổng Doanh Thu" 
              value={stats.revenue} 
              precision={0}
              formatter={formatCurrency}
              prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
              suffix={<small style={{ fontSize: 12, color: '#52c41a' }}><ArrowUpOutlined /> 12%</small>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic 
              title="Đơn hàng" 
              value={stats.orders} 
              prefix={<ShoppingCartOutlined style={{ color: '#1677ff' }} />}
              suffix={<small style={{ fontSize: 12, color: '#1677ff' }}><ArrowUpOutlined /> 5%</small>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic 
              title="Sách đang bán" 
              value={stats.books} 
              prefix={<ReadOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic 
              title="Khách hàng mới" 
              value={stats.customers} 
              prefix={<UserOutlined style={{ color: '#eb2f96' }} />}
              suffix={<small style={{ fontSize: 12, color: '#cf1322' }}><ArrowDownOutlined /> 2%</small>}
            />
          </Card>
        </Col>
      </Row>

      {/* --- BIỂU ĐỒ & TOP SẢN PHẨM --- */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {/* Biểu đồ doanh thu (Chiếm 16/24 phần) */}
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ doanh thu tuần qua" loading={loading}>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact" }).format(value)} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="total" stroke="#1677ff" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Top sách bán chạy (Chiếm 8/24 phần) */}
        <Col xs={24} lg={8}>
          <Card title="Sách bán chạy nhất" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={topSellingBooks}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9', color: '#fff' }}>{index + 1}</Avatar>}
                    title={item.title}
                    description={`${item.sales} cuốn đã bán`}
                  />
                  <div style={{ width: 60, textAlign: 'right', fontWeight: 'bold' }}>{item.percent}%</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* --- BẢNG ĐƠN HÀNG MỚI NHẤT --- */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Đơn hàng gần đây" loading={loading}>
            <Table 
              columns={columns} 
              dataSource={recentOrders} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;