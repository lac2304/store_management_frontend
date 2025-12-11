import React, { useState } from 'react';
import { 
  Table, Button, Space, Tag, Modal, message, Input, Breadcrumb, 
  Form, Select, InputNumber, Row, Col, Upload 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const BookList = () => {
  const [form] = Form.useForm();
  
  // --- STATE QUẢN LÝ ---
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái đóng/mở Modal
  const [editingBook, setEditingBook] = useState(null);  // Lưu sách đang sửa (null = thêm mới)

  // --- DỮ LIỆU MOCK (Giả lập Database) ---
  const categories = [
    { id: 'c1', name: 'Tiểu thuyết' },
    { id: 'c2', name: 'Kinh tế' },
    { id: 'c3', name: 'Khoa học' },
  ];
  const authors = [
    { id: 'a1', name: 'Nguyễn Nhật Ánh' },
    { id: 'a2', name: 'Haruki Murakami' },
    { id: 'a3', name: 'Adam Smith' },
  ];
  const publishers = [
    { id: 'p1', name: 'NXB Kim Đồng' },
    { id: 'p2', name: 'NXB Trẻ' },
  ];

  const [data, setData] = useState([
    {
      id: 'b1',
      key: '1',
      title: 'Mắt Biếc',
      image: 'https://img.websosanh.vn/v2/users/review/images/sach-mat-biec-nguyen-nhat-anh/sach-mat-biec-nguyen-nhat-anh.jpg',
      category: 'Tiểu thuyết',
      categoryId: 'c1',
      author: 'Nguyễn Nhật Ánh',
      authorId: 'a1',
      publisherId: 'p2',
      price: 95000,
      stock: 60,
      status: 'ACTIVE',
    },
    {
      id: 'b2',
      key: '2',
      title: 'Rừng Na Uy',
      image: 'https://bizweb.dktcdn.net/100/363/455/products/rung-na-uy-nhanam.jpg',
      category: 'Tiểu thuyết',
      categoryId: 'c1',
      author: 'Haruki Murakami',
      authorId: 'a2',
      publisherId: 'p2',
      price: 120000,
      stock: 20,
      status: 'ACTIVE',
    },
  ]);

  // --- HÀM MỞ MODAL THÊM MỚI ---
  const handleAddNew = () => {
    setEditingBook(null); // Reset trạng thái sửa
    form.resetFields();   // Xóa trắng form
    setIsModalOpen(true); // Mở Modal
  };

  // --- HÀM MỞ MODAL SỬA ---
  const handleEdit = (record) => {
    setEditingBook(record); // Lưu thông tin sách đang sửa
    form.setFieldsValue(record); // Đổ dữ liệu cũ vào form
    setIsModalOpen(true);
  };

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa sách?',
      content: 'Hành động này không thể hoàn tác.',
      okType: 'danger',
      onOk() {
        message.success('Đã xóa thành công');
        setData(data.filter(item => item.id !== id));
      },
    });
  };

  // --- HÀM SUBMIT FORM (LƯU/CẬP NHẬT) ---
  const onFinish = (values) => {
    setLoading(true);
    // Giả lập xử lý API
    setTimeout(() => {
      if (editingBook) {
        // LOGIC SỬA: Cập nhật vào mảng data cũ
        const newData = data.map(item => 
          item.id === editingBook.id ? { ...item, ...values } : item
        );
        setData(newData);
        message.success('Cập nhật thành công!');
      } else {
        // LOGIC THÊM: Tạo ID mới và thêm vào đầu mảng
        const newBook = {
          ...values,
          id: `new_${Date.now()}`,
          key: `${Date.now()}`,
          stock: 0, // Mặc định tồn kho = 0
          image: values.image || 'https://via.placeholder.com/150'
        };
        setData([newBook, ...data]);
        message.success('Thêm mới thành công!');
      }
      setLoading(false);
      setIsModalOpen(false); // Đóng modal
    }, 500);
  };

  // --- CỘT BẢNG ---
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src) => <img src={src} alt="book" style={{ width: 40, height: 60, objectFit: 'cover' }} />
    },
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
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
      </Breadcrumb>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." style={{ width: 300 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm sách mới
        </Button>
      </div>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      {/* --- MODAL FORM (Chính là BookForm cũ nhét vào đây) --- */}
      <Modal
        title={editingBook ? "Cập nhật thông tin sách" : "Thêm sách mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={800} // Độ rộng Modal
        footer={null} // Ẩn nút OK/Cancel mặc định để dùng nút trong Form
        destroyOnClose // Reset form khi đóng modal
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 'ACTIVE', price: 0 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên sách" rules={[{ required: true }]}>
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isbn" label="Mã ISBN">
                <Input placeholder="Nhập ISBN" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item name="categoryId" label="Thể loại">
                <Select placeholder="Chọn thể loại">
                  {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="authorId" label="Tác giả">
                <Select placeholder="Chọn tác giả">
                  {authors.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publisherId" label="Nhà xuất bản">
                <Select placeholder="Chọn NXB">
                  {publishers.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="ACTIVE">Kinh doanh</Option>
                  <Option value="DRAFT">Ngừng bán</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item name="image" label="Link Ảnh bìa">
                 <Input prefix={<UploadOutlined />} placeholder="Paste link ảnh vào đây..." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingBook ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BookList;