import { SvgIcon } from '@/components/svg/SvgIconBackupEran'

export function LeoProDd({ getOptionProps }) {
  return (
    <div className="pro-menu" aria-label="Fiverr Pro">
      <a
        className="pro-menu-item"
        href="#"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
        aria-label="Leo Pro: I’m looking to hire"
        {...(getOptionProps ? getOptionProps() : {})}
      >
        <div className="pro-menu-icon" aria-hidden="true">
          <SvgIcon icon="proHireIcon" width={56} height={56} />
        </div>

        <div className="pro-menu-text">
          <span className="pro-menu-title">I’m looking to hire</span>
          <span className="pro-menu-sub">
            My team needs vetted freelance talent and a premium business solution.
          </span>
        </div>
      </a>

      <div className="pro-menu-divider" role="separator" />

      <a
        className="pro-menu-item"
        href="#"
        target="_blank"
        rel="noreferrer"
        role="menuitem"
        aria-label="Leo Pro: I want to offer pro services"
        {...(getOptionProps ? getOptionProps() : {})}
      >
        <div className="pro-menu-icon" aria-hidden="true">
          <SvgIcon icon="proOfferIcon" width={56} height={56} />
        </div>

        <div className="pro-menu-text">
          <span className="pro-menu-title">I want to offer pro services</span>
          <span className="pro-menu-sub">
            I’d like to work on business projects as a Pro freelancer or agency.
          </span>
        </div>
      </a>
    </div>
  )
}
