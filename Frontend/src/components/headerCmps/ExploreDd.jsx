import { Link } from 'react-router-dom'

export function ExploreDd({ isOpen, onToggle }) {
  return (
    <div className="nav-dd">
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        Explore
        <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="nav-dd-panel nav-dd-panel-explore"
          role="menu"
          aria-label="Explore"
        >
          <Link to="/explorer" className="nav-dd-item compact" role="menuitem">
            <div className="nav-dd-title">GigExplore</div>
            <div className="nav-dd-sub">Continue to Gig</div>
          </Link>
          <a className="nav-dd-item compact" href="#" role="menuitem">
            <div className="nav-dd-title">Answers</div>
            <div className="nav-dd-sub">Powered by AI, answered by freelancers</div>
          </a>
          <a className="nav-dd-item compact" href="#" role="menuitem">
            <div className="nav-dd-title">Community</div>
            <div className="nav-dd-sub">Connect with Fiverr’s team and community</div>
          </a>
          <a className="nav-dd-item compact" href="#" role="menuitem">
            <div className="nav-dd-title">Guides</div>
            <div className="nav-dd-sub">In-depth business guides</div>
          </a>
          <a className="nav-dd-item compact" href="#" role="menuitem">
            <div className="nav-dd-title">Blog</div>
            <div className="nav-dd-sub">News and community stories</div>
          </a>
          <a className="nav-dd-item compact" href="#" role="menuitem">
            <div className="nav-dd-title">Logo Maker</div>
            <div className="nav-dd-sub">Create your logo instantly</div>
          </a>
        </div>
      )}
    </div>
  )
}
