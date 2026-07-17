import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState({ customers: 0, products: 0, orders: 0 });

  useEffect(() => {
    api.get('/dashboard/metrics').then((response) => setSummary(response.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Enterprise Data Platform</h1>
      <p>Dashboard Running</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div><strong>Customers:</strong> {summary.customers}</div>
        <div><strong>Products:</strong> {summary.products}</div>
        <div><strong>Orders:</strong> {summary.orders}</div>
      </div>
    </div>
  );
}