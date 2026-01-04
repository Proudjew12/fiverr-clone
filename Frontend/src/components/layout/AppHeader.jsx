import { Link, NavLink } from 'react-router-dom'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-inner container grid align-center">
        {/* Logo */}
        <Link to="/" className="logo" aria-label="Go to homepage">
          fiverr
        </Link>

        {/* Navigation */}
        <nav className="nav grid align-center">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="header-actions grid align-center">
          <button type="button" className="btn btn-ghost">
            Sign in
          </button>
          <button type="button" className="btn">
            Join
          </button>
        </div>
      </div>
    </header>
  )
}
