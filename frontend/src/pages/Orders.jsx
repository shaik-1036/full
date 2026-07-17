import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((response) => setOrders(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Sales</p>
          <h2>Orders</h2>
        </div>
        <span className="pill">{orders.length} orders</span>
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
            {orders.map((order) => (
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