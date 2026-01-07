export function FiverrProHeader() {
  return (
    <div className="pro-menu" aria-label="Fiverr Pro">
      {/* ITEM 1 */}
      <a
        className="pro-menu-item"
        href="https://pro.fiverr.com/?source=header_pop_up"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
        aria-label="Leo Pro: I’m looking to hire"
      >
        <div className="pro-menu-icon" aria-hidden="true">
          <img
            src="/assets/HeaderIcons/1[H].png"
            alt=""
            width={56}
            height={56}
            loading="lazy"
          />
        </div>

        <div className="pro-menu-text">
          <span className="pro-menu-title">I’m looking to hire</span>
          <span className="pro-menu-sub">
            My team needs vetted freelance talent and a premium business solution.
          </span>
        </div>
      </a>

      <div className="pro-menu-divider" role="separator" />

      {/* ITEM 2 */}
      <a
        className="pro-menu-item"
        href="https://pro.fiverr.com/cp/pro-freelancers?source=header_pop_up"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
        aria-label="Leo Pro: I want to offer pro services"
      >
        <div className="pro-menu-icon" aria-hidden="true">
          <img
            src="/assets/HeaderIcons/2[H].png"
            alt=""
            width={56}
            height={56}
            loading="lazy"
          />
        </div>

        <div className="pro-menu-text">
          <span className="pro-menu-title">I want to offer pro services</span>
          <span className="pro-menu-sub">
            I’d like to work on business projects as a Pro freelancer or agency.
          </span>
        </div>
      </a>

      {/* <div className="pro-menu-divider" role="separator" /> */}

      {/* ITEM 3 */}
      {/* <a className="pro-menu-item" href="#" role="menuitem" aria-label="Leo Pro">
        <div className="pro-menu-icon" aria-hidden="true">
          <img
            src="/assets/HeaderIcons/4[H].jpg"
            alt=""
            width={56}
            height={56}
            loading="lazy"
          />
        </div>

        <div className="pro-menu-text">
          <span className="pro-menu-title">Leo Pro [The Real Thing]</span>
          <span className="pro-menu-sub">⚡Click here to get your SuperPowers⚡</span>
        </div>
      </a> */}
    </div>
  )
}
