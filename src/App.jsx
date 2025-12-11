import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
// import './App.css'  <-- Có thể giữ lại nếu bạn muốn dùng style chung, hoặc xóa đi nếu dùng thư viện khác

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App