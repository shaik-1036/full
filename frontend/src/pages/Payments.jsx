import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/payments').then((response) => setPayments(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order</th>
            <th>Method</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id}>
              <td>{payment.payment_id}</td>
              <td>{payment.order_id}</td>
              <td>{payment.payment_method}</td>
              <td>{payment.payment_status}</td>
              <td>{payment.payment_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
