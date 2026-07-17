import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/customers').then((response) => setCustomers(response.data.data || [])).catch(console.error);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Customers</h2>
        </div>
        <span className="pill">{customers.length} profiles</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Today</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.email}</td>
                <td>{customer.city}, {customer.country}</td>
                <td>
                  <span className="badge info">{customer.created_at ? new Date(customer.created_at).toLocaleString() : '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}