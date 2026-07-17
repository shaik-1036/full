import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/payments').then((response) => setPayments(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Finance</p>
          <h2>Payments</h2>
        </div>
        <span className="pill">{payments.length} transactions</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Latest</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_id}</td>
                <td>{payment.order_id}</td>
                <td>{payment.payment_method}</td>
                <td><span className={payment.payment_status === 'Completed' ? 'badge success' : 'badge warning'}>{payment.payment_status}</span></td>
                <td>${Number(payment.payment_amount || 0).toFixed(2)}</td>
                <td><span className="badge info">{payment.updated_at ? new Date(payment.updated_at).toLocaleString() : '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
