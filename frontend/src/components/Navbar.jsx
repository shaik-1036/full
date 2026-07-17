import { Link, useNavigate, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/order-items', label: 'Order Items' },
  { to: '/payments', label: 'Payments' },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/warehouses', label: 'Warehouses' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/shipments', label: 'Shipments' },
  { to: '/returns', label: 'Returns' },
  { to: '/metrics', label: 'Metrics' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="top-nav">
      <div className="brand-block">
        <div className="brand-dot" />
        <div>
          <strong>Enterprise Data Hub</strong>
          <div className="brand-subtitle">Live ops, refresh-ready data, and modern views</div>
        </div>
      </div>
      <div className="nav-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}>
            {link.label}
          </Link>
        ))}
        {token ? <button className="logout-btn" onClick={logout}>Logout</button> : <Link to='/login' className="nav-link">Login</Link>}
      </div>
    </nav>
  );
}