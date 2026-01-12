import { Link } from 'react-router-dom'
import { SvgIcon } from '../svg/SvgIconBackupEran'

export function ExploreDd({ isOpen, onToggle, onClose }) {
  return (
    <div className="nav-dd">
      <ExploreTrigger isOpen={isOpen} onToggle={onToggle} />
      {isOpen && <ExplorePanel onClose={onClose} />}
    </div>
  )
}

/* =========================
   Trigger
   ========================= */

function ExploreTrigger({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      className="nav-dd-trigger"
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={onToggle}
    >
      Explore
      <span className={`nav-arrow-down ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
        <SvgIcon icon="chevronDown" />
      </span>
    </button>
  )
}

/* =========================
   Panel
   ========================= */

function ExplorePanel({ onClose }) {
  function onDisabledClick(ev) {
    ev.preventDefault()
    onClose?.()
  }

  function onItemClick() {
    onClose?.()
  }

  return (
    <div className="nav-dd-panel nav-dd-panel-explore" role="menu" aria-label="Explore">
      {/* Gig Explore */}
      <Link
        to="/index"
        className="nav-dd-item compact"
        role="menuitem"
        onClick={onItemClick}
      >
        <div className="nav-dd-title">GigExplore</div>
        <div className="nav-dd-sub">Continue to Gig</div>
      </Link>

      {/* Answers */}
      <a
        className="nav-dd-item compact"
        href="#"
        role="menuitem"
        onClick={onDisabledClick}
      >
        <div className="nav-dd-title">Answers</div>
        <div className="nav-dd-sub">Powered by AI, answered by freelancers</div>
      </a>

      {/* Community */}
      <a
        className="nav-dd-item compact"
        href="#"
        role="menuitem"
        onClick={onDisabledClick}
      >
        <div className="nav-dd-title">Community</div>
        <div className="nav-dd-sub">Connect with Fiverr’s team and community</div>
      </a>

      {/* Guides */}
      <a
        className="nav-dd-item compact"
        href="#"
        role="menuitem"
        onClick={onDisabledClick}
      >
        <div className="nav-dd-title">Guides</div>
        <div className="nav-dd-sub">In-depth business guides</div>
      </a>

      {/* Blog */}
      <a
        className="nav-dd-item compact"
        href="#"
        role="menuitem"
        onClick={onDisabledClick}
      >
        <div className="nav-dd-title">Blog</div>
        <div className="nav-dd-sub">News and community stories</div>
      </a>

      {/* Logo Maker */}
      <a
        className="nav-dd-item compact"
        href="#"
        role="menuitem"
        onClick={onDisabledClick}
      >
        <div className="nav-dd-title">Logo Maker</div>
        <div className="nav-dd-sub">Create your logo instantly</div>
      </a>
    </div>
  )
}
