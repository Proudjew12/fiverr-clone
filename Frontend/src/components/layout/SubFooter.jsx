const SUB_FOOTER_COLUMNS = [
  {
    title: 'Categories',
    items: ['Graphics & Design', 'Programming & Tech', 'Digital Marketing', 'Video & Animation'],
  },
  {
    title: 'For Clients',
    items: ['Customer Success Stories'],
  },
  {
    title: 'For Freelancers',
    items: ['Become a Freelancer'],
  },
  {
    title: 'Business Solutions',
    items: ['Strategy & Roadmaps'],
  },
  {
    title: 'Company',
    items: ['About Leo', 'Contact Us'],
  },
]

export function SubFooter() {
  function onLinkClick(ev) {
    ev.preventDefault()
  }

  return (
    <section className="sub-footer">
      <div className="sub-footer-inner">
        {SUB_FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="sub-footer-col">
            <h4 className="sub-footer-title">{col.title}</h4>
            <ul className="sub-footer-list">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="sub-footer-link" onClick={onLinkClick}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
