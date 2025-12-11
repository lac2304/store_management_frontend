import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // Quản lý Tab đang mở

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const onFinishLogin = (values) => {
    setLoading(true);
    console.log('Dữ liệu Login:', values);

    // Giả lập gọi API (Sau này thay bằng axiosClient.post)
    setTimeout(() => {
      setLoading(false);
      // Giả sử đăng nhập thành công -> Lưu token -> Chuyển hướng
      // localStorage.setItem('token', 'fake-token'); 
      message.success('Đăng nhập thành công!');
      navigate('/admin'); // Chuyển vào trang Dashboard
    }, 1000);
  };

  // --- XỬ LÝ ĐĂNG KÝ ---
  const onFinishRegister = (values) => {
    setLoading(true);
    console.log('Dữ liệu Register:', values);

    // Giả lập gọi API
    setTimeout(() => {
      setLoading(false);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setActiveTab('login'); // Tự động chuyển về tab Login
    }, 1000);
  };

  // --- COMPONENT FORM ĐĂNG NHẬP ---
  const LoginForm = () => (
    <Form
      name="login_form"
      onFinish={onFinishLogin}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tài khoản / Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>
        <a style={{ float: 'right' }} href="">Quên mật khẩu?</a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Đăng Nhập
        </Button>
      </Form.Item>
    </Form>
  );

  // --- COMPONENT FORM ĐĂNG KÝ ---
  const RegisterForm = () => (
    <Form
      name="register_form"
      onFinish={onFinishRegister}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Vui lòng chọn tên đăng nhập!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập Email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Hai mật khẩu không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Đăng Ký Ngay
        </Button>
      </Form.Item>
    </Form>
  );

  // --- CẤU TRÚC TAB ---
  const tabItems = [
    { key: 'login', label: 'Đăng Nhập', children: <LoginForm /> },
    { key: 'register', label: 'Đăng Ký', children: <RegisterForm /> },
  ];

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
           <h2 style={{ color: '#1677ff', margin: 0 }}>BOOK STORE MANAGER</h2>
           <p style={{ color: '#888' }}>Hệ thống quản lý cửa hàng sách</p>
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems} 
          centered 
        />
      </Card>
    </div>
  );
};

// CSS inline đơn giản để căn giữa màn hình
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Màu nền gradient nhẹ
  },
  card: {
    width: 400,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Đổ bóng cho đẹp
    borderRadius: 8
  }
};

export default LoginPage;