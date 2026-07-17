import { useEffect, useState } from 'react';
import api from '../services/api';
import { filterRecords } from '../utils/filterData';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    api.get('/products').then((response) => setProducts(response.data.data || [])).catch(console.error);
  }, []);

  const visibleProducts = filterRecords(products, { query, categoryFilter });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Products</h2>
        </div>
        <span className="pill">{visibleProducts.length} shown</span>
      </div>
      <div className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="all">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
        </select>
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
            {visibleProducts.map((product) => (
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