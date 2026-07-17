import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((response) => setProducts(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Products</h2>
        </div>
        <span className="pill">{products.length} items</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Latest</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.category}</td>
                <td>${Number(product.price || 0).toFixed(2)}</td>
                <td>{product.stock_quantity}</td>
                <td><span className="badge info">{product.updated_at ? new Date(product.updated_at).toLocaleString() : '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}