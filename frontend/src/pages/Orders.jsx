import { useEffect, useState } from 'react';
import api from '../services/api';
import { filterRecords } from '../utils/filterData';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/orders').then((response) => setOrders(response.data.data || [])).catch(console.error);
  }, []);

  const visibleOrders = filterRecords(orders, { query, dateFilter, statusFilter });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Sales</p>
          <h2>Orders</h2>
        </div>
        <span className="pill">{visibleOrders.length} shown</span>
      </div>
      <div className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" />
        <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Latest</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_id}</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>${Number(order.total_amount || 0).toFixed(2)}</td>
                <td><span className={order.status === 'Completed' ? 'badge success' : 'badge warning'}>{order.status}</span></td>
                <td><span className="badge info">{order.updated_at ? new Date(order.updated_at).toLocaleString() : '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}