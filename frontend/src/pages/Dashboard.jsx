import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState({ customers: 0, products: 0, orders: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const load = () => {
      api.get('/dashboard/metrics').then((response) => {
        setSummary(response.data);
        setLastUpdated(new Date());
      }).catch(console.error);
    };

    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div>
      <section className="hero">
        <p className="eyebrow">Operations overview</p>
        <h1>Enterprise Data Platform</h1>
        <p>Refresh-driven inventory, orders, payments, Returns, and logistics views are available in one place.</p>
        <div className="hero-row">
          <div className="metric-card">
            <div className="metric-label">Customers</div>
            <div className="metric-value">{summary.customers}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Products</div>
            <div className="metric-value">{summary.products}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Orders</div>
            <div className="metric-value">{summary.orders}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Last refresh</div>
            <div className="metric-value">{lastUpdated.toLocaleTimeString()}</div>
          </div>
        </div>
      </section>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Live data</p>
            <h2>Today’s operational snapshot</h2>
          </div>
          <span className="pill">Auto-refresh every 30s</span>
        </div>
        <p style={{ color: '#9fb0cb', margin: 0 }}>Each record view shows the latest timestamp so you can tell when the nightly refresh updated the data.</p>
      </div>
    </div>
  );
}