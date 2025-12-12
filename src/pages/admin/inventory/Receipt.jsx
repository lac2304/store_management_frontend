import React, { useState } from 'react';
import { 
  Tabs, Table, Button, Tag, Breadcrumb, Form, Select, 
  InputNumber, DatePicker, Card, Space, message, Row, Col, Typography 
} from 'antd';
import { PlusOutlined, DeleteOutlined, HistoryOutlined, FileAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const Receipt = () => {
  const [activeTab, setActiveTab] = useState('1');

  // --- TAB 1: LỊCH SỬ NHẬP HÀNG ---
  const HistoryTab = () => {
    // Mock data lịch sử
    const historyData = [
      { id: 'rec1', date: '2025-12-07', supplier: 'Công ty Fahasa', total: 5000000, status: 'COMPLETED', staff: 'Admin' },
      { id: 'rec2', date: '2025-12-08', supplier: 'Nhã Nam', total: 2400000, status: 'DRAFT', staff: 'NV A' },
    ];

    const columns = [
      { title: 'Mã Phiếu', dataIndex: 'id', render: t => <b>{t}</b> },
      { title: 'Ngày nhập', dataIndex: 'date' },
      { title: 'Nhà cung cấp', dataIndex: 'supplier' },
      { title: 'Người nhập', dataIndex: 'staff' },
      { 
        title: 'Tổng tiền', 
        dataIndex: 'total', 
        render: v => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)}
        </span> 
      },
      { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'COMPLETED' ? 'green' : 'orange'}>{s}</Tag> },
    ];

    return (
      <Table 
        columns={columns} 
        dataSource={historyData} 
        rowKey="id" 
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>Chi tiết sách của phiếu {record.id} (Sẽ làm chức năng xem chi tiết sau)</p>,
        }}
      />
    );
  };

  // --- TAB 2: TẠO PHIẾU NHẬP MỚI (QUAN TRỌNG) ---
  const CreateReceiptTab = () => {
    const [form] = Form.useForm();
    const [totalCost, setTotalCost] = useState(0);

    // Mock data sách để chọn nhập
    const books = [
      { id: 'b1', title: 'Mắt Biếc' },
      { id: 'b2', title: 'Rừng Na Uy' },
      { id: 'b3', title: 'Kinh Tế Học' },
    ];

    // Tính tổng tiền realtime khi thay đổi số lượng/giá
    const handleValuesChange = (_, allValues) => {
      const details = allValues.details || [];
      const total = details.reduce((sum, item) => {
        return sum + ((item?.quantity || 0) * (item?.unitCost || 0));
      }, 0);
      setTotalCost(total);
    };

    const onFinish = (values) => {
      console.log('Dữ liệu nhập hàng:', values);
      message.success('Tạo phiếu nhập thành công!');
      form.resetFields();
      setTotalCost(0);
      setActiveTab('1'); // Chuyển về tab lịch sử
    };

    return (
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        initialValues={{ receiptDate: dayjs(), details: [{}] }}
      >
        <Row gutter={24}>
          {/* CỘT TRÁI: THÔNG TIN PHIẾU */}
          <Col span={8}>
            <Card title="Thông tin chung" bordered={false}>
              <Form.Item name="supplierId" label="Nhà cung cấp" rules={[{ required: true }]}>
                <Select placeholder="Chọn NCC">
                  <Option value="sup1">Công ty Fahasa</Option>
                  <Option value="sup2">Nhã Nam</Option>
                </Select>
              </Form.Item>
              <Form.Item name="receiptDate" label="Ngày nhập">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Tổng tiền dự tính">
                 <Title level={3} style={{ color: '#cf1322', margin: 0 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCost)}
                 </Title>
              </Form.Item>
              <Button type="primary" htmlType="submit" block size="large" icon={<FileAddOutlined />}>
                Lưu Phiếu Nhập
              </Button>
            </Card>
          </Col>

          {/* CỘT PHẢI: DANH SÁCH SÁCH */}
          <Col span={16}>
            <Card title="Chi tiết hàng nhập" bordered={false}>
              <Form.List name="details">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={8} align="middle" style={{ marginBottom: 10, background: '#fafafa', padding: 10, borderRadius: 8 }}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'bookId']}
                            rules={[{ required: true, message: 'Chọn sách' }]}
                            style={{ margin: 0 }}
                          >
                            <Select placeholder="Chọn sách" showSearch>
                              {books.map(b => <Option key={b.id} value={b.id}>{b.title}</Option>)}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[{ required: true, message: 'Nhập SL' }]}
                            style={{ margin: 0 }}
                          >
                            <InputNumber placeholder="Số lượng" min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'unitCost']}
                            rules={[{ required: true, message: 'Nhập giá' }]}
                            style={{ margin: 0 }}
                          >
                            <InputNumber 
                                placeholder="Giá nhập" 
                                min={0} 
                                style={{ width: '100%' }} 
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm dòng sách
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[{ title: 'Admin' }, { title: 'Kho hàng' }, { title: 'Nhập hàng' }]} />
      
      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: '1', label: <span><HistoryOutlined /> Lịch sử Nhập hàng</span>, children: <HistoryTab /> },
            { key: '2', label: <span><FileAddOutlined /> Tạo Phiếu Nhập</span>, children: <CreateReceiptTab /> },
          ]}
        />
      </div>
    </div>
  );
};

export default Receipt;