import { useEffect, useState } from 'react';
import api from '../services/api';

export default function OrderItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/order-items').then((response) => setItems(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Order Items</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.order_item_id}>
              <td>{item.order_item_id}</td>
              <td>{item.order_id}</td>
              <td>{item.product_id}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
