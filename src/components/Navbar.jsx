import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/logo.jpg"
          alt="Logo"
          width="40"
          height="40"
          className="d-inline-block align-text-top me-2 rounded"
        />
        Cukecute
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ingredient">Ingredient</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
