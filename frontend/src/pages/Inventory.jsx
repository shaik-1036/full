import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/inventory').then((response) => setItems(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Inventory</h2>
        </div>
        <span className="pill">{items.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Warehouse ID</th>
              <th>Stock</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.inventory_id}>
                <td>{item.inventory_id}</td>
                <td>{item.product_id}</td>
                <td>{item.warehouse_id}</td>
                <td>{item.stock_quantity}</td>
                <td>{item.updated_at ? new Date(item.updated_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
