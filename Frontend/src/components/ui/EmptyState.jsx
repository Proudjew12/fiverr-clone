export function EmptyState({
  title = "We couldn't find any services that match your search",
  subtitle = 'Try another keyword to optimize your search.',
  cta = 'Hire freelance talent by creating a project brief',
}) {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-state-inner">
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-subtitle">{subtitle}</p>

        <div className="empty-state-divider" role="presentation">
          <span className="empty-line" />
          <span className="empty-or">Or</span>
          <span className="empty-line" />
        </div>

        <p className="empty-state-cta">{cta}</p>
      </div>
    </section>
  )
}
