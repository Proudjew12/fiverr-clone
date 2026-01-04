export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner container grid align-center">
        <p className="copyright">© {new Date().getFullYear()} Fiverr Clone</p>

        <nav className="footer-nav grid align-center" aria-label="Footer">
          <a href="#" className="footer-link">
            Terms
          </a>
          <a href="#" className="footer-link">
            Privacy
          </a>
          <a href="#" className="footer-link">
            Help
          </a>
        </nav>
      </div>
    </footer>
  )
}
