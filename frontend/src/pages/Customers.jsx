import { useEffect, useState } from 'react';
import api from '../services/api';
import { filterRecords } from '../utils/filterData';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    api.get('/customers').then((response) => setCustomers(response.data.data || [])).catch(console.error);
  }, []);

  const visibleCustomers = filterRecords(customers, { query, dateFilter });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Customers</h2>
        </div>
        <span className="pill">{visibleCustomers.length} shown</span>
      </div>
      <div className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers" />
        <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
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
            {visibleCustomers.map((customer) => (
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