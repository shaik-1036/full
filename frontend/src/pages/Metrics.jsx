import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Metrics() {
  const [metrics, setMetrics] = useState({ customers: 0, products: 0, orders: 0 });

  useEffect(() => {
    api.get('/dashboard/metrics').then((response) => setMetrics(response.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>API Metrics</h2>
      <ul>
        <li>Customers: {metrics.customers}</li>
        <li>Products: {metrics.products}</li>
        <li>Orders: {metrics.orders}</li>
      </ul>
    </div>
  );
}
