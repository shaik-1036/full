import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import Payments from './pages/Payments';
import Metrics from './pages/Metrics';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' replace />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/customers' element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='/order-items' element={<ProtectedRoute><OrderItems /></ProtectedRoute>} />
        <Route path='/payments' element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path='/metrics' element={<ProtectedRoute><Metrics /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}