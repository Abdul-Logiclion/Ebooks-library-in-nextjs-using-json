
import Link from 'next/link';
import '@/public/css/nav-bar.css';

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <span className="navbar-toggle" id="js-navbar-toggle">
          <i className="fas fa-bars" />
        </span>
        <Link href="/" className="logo">
          Book Store
        </Link>
        {/*<img src="img/logo.png" alt="" width="200" height="200">*/}
        <ul className="main-nav" id="js-menu">
          <li>
            <Link href="/" className="nav-links">
              Books
            </Link>
          </li>
          <li>
            <Link href="/addbook" className="nav-links">
              Add Book
            </Link>
          </li>
          <li>
            <Link href="/author-summary" className="nav-links">
              Author Book Summary
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
