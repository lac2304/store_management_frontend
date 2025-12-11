import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ReadOutlined,
  ShopOutlined,
  TeamOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🔥 FIX QUAN TRỌNG: Lấy ngay pathname hiện tại làm state khởi tạo
  // Để khi F5 trang, menu vẫn sáng đúng chỗ
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  // Khi URL thay đổi (ví dụ bấm Back trên trình duyệt), menu tự cập nhật theo
  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const handleLogout = () => {
    // localStorage.removeItem('token'); // Xóa token nếu có
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  // --- DANH SÁCH MENU (Mapping khớp với AppRouter) ---
  const menuItems = [
    {
      key: '/admin', // Khớp với route index
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'sub1', // Key của nhóm con
      icon: <ReadOutlined />,
      label: 'Quản lý Sản phẩm',
      children: [
        { key: '/admin/products', label: 'Danh sách Sách' },
        { key: '/admin/categories', label: 'Danh mục Thể loại' },
        { key: '/admin/authors', label: 'Tác giả' },
        { key: '/admin/publishers', label: 'Nhà xuất bản' },
      ],
    },
    {
      key: 'sub2',
      icon: <ShopOutlined />,
      label: 'Kho & Nhập hàng',
      children: [
        { key: '/admin/inventory', label: 'Xem Tồn kho' },
        { key: '/admin/receipts', label: 'Nhập hàng / Phiếu nhập' }, // Gom chung vào Receipt.jsx
        { key: '/admin/suppliers', label: 'Nhà cung cấp' },
      ],
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: '/admin/vouchers',
      icon: <TagsOutlined />,
      label: 'Khuyến mãi (Voucher)',
    },
    {
      key: 'sub3',
      icon: <TeamOutlined />,
      label: 'Nhân sự',
      children: [
        { key: '/admin/staff', label: 'Danh sách Nhân viên' },
        { key: '/admin/shifts', label: 'Lịch sử Ca làm việc' },
      ],
    },
  ];

  // Menu user góc phải
  const userMenu = {
    items: [
      {
        key: '1',
        label: 'Hồ sơ cá nhân',
        icon: <UserOutlined />,
      },
      { type: 'divider' },
      {
        key: '2',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR TRÁI */}
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div style={styles.logoContainer}>
           <div style={styles.logoText}>
              {collapsed ? 'BS' : 'BOOK STORE'}
           </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          // Mặc định mở hết các nhóm con để dễ nhìn
          defaultOpenKeys={['sub1', 'sub2', 'sub3']} 
          // Highlight mục đang chọn
          selectedKeys={selectedKeys} 
          // Danh sách items đã cấu hình ở trên
          items={menuItems}
          // Sự kiện click chuyển trang
          onClick={({ key }) => navigate(key)} 
        />
      </Sider>

      {/* NỘI DUNG PHẢI */}
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          <div style={{ marginRight: 24 }}>
            <Dropdown menu={userMenu} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                <span style={{ fontWeight: 500 }}>Admin User</span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto' 
          }}
        >
          {/* Outlet: Nơi Router "đổ" trang con vào đây */}
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center', color: '#888' }}>
          Book Store Manager ©2025 Created by YourName
        </Footer>
      </Layout>
    </Layout>
  );
};

const styles = {
  logoContainer: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  }
};

export default AdminLayout;