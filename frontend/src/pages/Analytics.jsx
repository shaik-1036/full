import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState({ customers: 0, products: 0, orders: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/metrics'),
      api.get('/orders')
    ])
      .then(([metricsResponse, ordersResponse]) => {
        setStats(metricsResponse.data);
        setOrders(ordersResponse.data.data || []);
      })
      .catch(console.error);
  }, []);

  const completed = orders.filter((order) => order.status === 'Completed').length;
  const pending = orders.length - completed;
  const totalValue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Business overview</h2>
        </div>
        <span className="pill">Live metrics</span>
      </div>
      <div className="hero-row">
        <div className="metric-card">
          <div className="metric-label">Customers</div>
          <div className="metric-value">{stats.customers}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Products</div>
          <div className="metric-value">{stats.products}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Orders</div>
          <div className="metric-value">{stats.orders}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Revenue</div>
          <div className="metric-value">${totalValue.toFixed(2)}</div>
        </div>
      </div>
      <div className="hero-row" style={{ marginTop: 16 }}>
        <div className="metric-card">
          <div className="metric-label">Completed</div>
          <div className="metric-value">{completed}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pending</div>
          <div className="metric-value">{pending}</div>
        </div>
      </div>
    </div>
  );
}
