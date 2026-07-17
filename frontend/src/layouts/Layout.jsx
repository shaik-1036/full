import Navbar from '../components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  );
}
