import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Suppliers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/suppliers').then((response) => setItems(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Suppliers</h2>
        </div>
        <span className="pill">{items.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>City</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.supplier_id}>
                <td>{item.supplier_id}</td>
                <td>{item.supplier_name}</td>
                <td>{item.contact_name}</td>
                <td>{item.email}</td>
                <td>{item.city}</td>
                <td>{item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
