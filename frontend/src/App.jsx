import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import Payments from './pages/Payments';
import Suppliers from './pages/Suppliers';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Shipments from './pages/Shipments';
import Returns from './pages/Returns';
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
        <Route path='/suppliers' element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path='/warehouses' element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
        <Route path='/inventory' element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path='/shipments' element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
        <Route path='/returns' element={<ProtectedRoute><Returns /></ProtectedRoute>} />
        <Route path='/metrics' element={<ProtectedRoute><Metrics /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}