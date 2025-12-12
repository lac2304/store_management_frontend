import React, { useState } from 'react';
import { Table, Tag, Input, Breadcrumb, Card, Statistic, Row, Col } from 'antd';
import { SearchOutlined, WarningOutlined, ShopOutlined } from '@ant-design/icons';

const InventoryStatus = () => {
  // --- MOCK DATA: Kết hợp giữa Books và Inventories ---
  const [data] = useState([
    { id: 'b1', title: 'Mắt Biếc', isbn: 'ISBN001', stock: 60, reserved: 2, status: 'ACTIVE' },
    { id: 'b2', title: 'Rừng Na Uy', isbn: 'ISBN002', stock: 5, reserved: 0, status: 'ACTIVE' }, // Sắp hết
    { id: 'b3', title: 'Kinh tế học', isbn: 'ISBN003', stock: 0, reserved: 0, status: 'DRAFT' },  // Hết hàng
  ]);

  const columns = [
    { title: 'Mã ISBN', dataIndex: 'isbn', key: 'isbn', render: t => <Tag>{t}</Tag> },
    { title: 'Tên sách', dataIndex: 'title', key: 'title', render: t => <b>{t}</b> },
    { 
      title: 'Tồn kho thực tế', 
      dataIndex: 'stock', 
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => {
        let color = 'green';
        if (stock === 0) color = 'red';
        else if (stock < 10) color = 'orange';
        
        return (
          <Tag color={color} style={{ fontSize: 14, padding: '4px 10px' }}>
            {stock} cuốn
          </Tag>
        );
      }
    },
    { title: 'Đang giao dịch', dataIndex: 'reserved', key: 'reserved', render: t => `${t} cuốn` },
    { 
      title: 'Trạng thái', 
      key: 'alert', 
      render: (_, record) => {
        if (record.stock === 0) return <span style={{ color: 'red' }}><WarningOutlined /> Hết hàng</span>;
        if (record.stock < 10) return <span style={{ color: 'orange' }}>Sắp hết</span>;
        return <span style={{ color: 'green' }}>Ổn định</span>;
      }
    }
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Kho hàng' }, { title: 'Tồn kho' }]} />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng số đầu sách" value={data.length} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Sách sắp hết (<10)" value={data.filter(x => x.stock < 10 && x.stock > 0).length} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Hết hàng" value={data.filter(x => x.stock === 0).length} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Input prefix={<SearchOutlined />} placeholder="Tra cứu tồn kho..." style={{ width: 400, marginBottom: 16 }} />
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default InventoryStatus;