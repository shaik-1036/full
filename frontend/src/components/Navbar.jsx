import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
      <Link to='/dashboard'>Dashboard</Link>
      <Link to='/customers'>Customers</Link>
      <Link to='/products'>Products</Link>
      <Link to='/orders'>Orders</Link>
      <Link to='/payments'>Payments</Link>
      <Link to='/metrics'>Metrics</Link>
      {token ? <button onClick={logout}>Logout</button> : <Link to='/login'>Login</Link>}
    </nav>
  );
}