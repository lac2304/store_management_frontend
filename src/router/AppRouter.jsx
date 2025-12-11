import { Routes, Route, Navigate } from 'react-router-dom';

// --- 1. Import Layout (Khung sườn) ---
import AdminLayout from '../layouts/AdminLayout';

// --- 2. Import Auth ---
import LoginPage from '../pages/auth/LoginPage';

// --- 3. Import Admin Pages (Theo danh sách bạn cung cấp) ---
// Dashboard
import DashboardPage from '../pages/admin/DashboardPage';

// Products
import BookList from '../pages/admin/products/BookList';
import CategoryList from '../pages/admin/products/CategoryList';
import AuthorList from '../pages/admin/products/AuthorList';
import PublisherList from '../pages/admin/products/PublisherList';

// Inventory
import InventoryStatus from '../pages/admin/inventory/InventoryStatus';
import Receipt from '../pages/admin/inventory/Receipt.jsx'; // Đã cập nhật tên file này
import SupplierList from '../pages/admin/inventory/SupplierList';

// Marketing
import VoucherList from '../pages/admin/marketing/VoucherList';

// Orders
import OrderHistory from '../pages/admin/orders/OrderHistory';

// Staff
import EmployeeList from '../pages/admin/staff/EmployeeList';
import ShiftHistory from '../pages/admin/staff/ShiftHistory';

const AppRouter = () => {
  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* === PRIVATE ROUTES (ADMIN) === */}
      <Route path="/admin" element={<AdminLayout />}>
        
        {/* Dashboard (Mặc định) */}
        <Route index element={<DashboardPage />} />

        {/* Quản lý Sản phẩm */}
        <Route path="products" element={<BookList />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="authors" element={<AuthorList />} />
        <Route path="publishers" element={<PublisherList />} />

        {/* Quản lý Kho */}
        <Route path="inventory" element={<InventoryStatus />} /> {/* Xem tồn kho */}
        <Route path="receipts" element={<Receipt />} />          {/* Nhập hàng & Lịch sử */}
        <Route path="suppliers" element={<SupplierList />} />

        {/* Quản lý Kinh doanh */}
        <Route path="vouchers" element={<VoucherList />} />
        <Route path="orders" element={<OrderHistory />} />

        {/* Quản lý Nhân sự */}
        <Route path="staff" element={<EmployeeList />} />
        <Route path="shifts" element={<ShiftHistory />} />

      </Route>

      {/* Route lạ -> Đá về login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;