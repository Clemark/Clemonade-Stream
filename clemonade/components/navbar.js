import "../styles/navbar.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link href="/">Home</Link>
        {/* <Link href="/widgets">Widgets</Link> */}
        <Link href="/api/valorant">Valochat</Link>
        <a
          href="https://discord.gg/jwAdyyhFMY"
          target="_blank"
          rel="noopener noreferrer"
        >
          Community
        </a>
      </div>
    </nav>
  );
}
