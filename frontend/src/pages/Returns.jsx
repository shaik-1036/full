import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Returns() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/returns').then((response) => setItems(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Returns</h2>
        </div>
        <span className="pill">{items.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.return_id}>
                <td>{item.return_id}</td>
                <td>{item.order_id}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
                <td>{item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
