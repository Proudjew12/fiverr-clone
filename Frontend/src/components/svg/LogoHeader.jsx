import { Link } from 'react-router-dom'

export function LogoHeader() {
  return (
    <Link to="/" className="site-logo" aria-label="Go to homepage">
      <span className="site-logo-text">Leo</span>
    </Link>
  )
}
