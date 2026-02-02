import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

const BENEFITS = [
  'Over 700 categories',
  'Quality work done faster',
  'Access to talent and businesses across the globe',
]

const PASSWORD_RULES = [
  'At least 8 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 number',
]

export function JoinModal({ children }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const canContinue = email.trim().length > 0 && password.trim().length > 0

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setEmail('')
      setPassword('')
      setShowPassword(false)
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="join-overlay" />
        <Dialog.Content className="join-modal" aria-label="Join">
          <section className="join-left">
            <div className="join-left-media">
              <img
                className="join-left-img"
                src="https://proxy.extractcss.dev/https://fiverr-res.cloudinary.com/npm-assets/layout-service/standard.0638957.png"
                alt="Setup illustration banner"
                loading="lazy"
              />
              <div className="join-left-overlay">
                <h2 className="join-left-title">Success starts here</h2>
                <ul className="join-benefits clean-list">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="join-benefit">
                      <span className="join-benefit-icon" aria-hidden="true">
                        <CheckSmallIcon />
                      </span>
                      <p className="join-benefit-text">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="join-right">
            <header className="join-header">
              <div className="join-header-grid">
                <div className="join-header-left">
                  <Dialog.Close asChild>
                    <button type="button" className="join-back">
                      <span className="join-back-icon" aria-hidden="true">
                        <BackArrowIcon />
                      </span>
                      <span className="join-back-text">Back</span>
                    </button>
                  </Dialog.Close>
                </div>
                <div className="join-header-center">
                  <span className="site-logo-text join-logo-text">Leo</span>
                </div>
                <div className="join-header-right" />
              </div>
            </header>

            <div className="join-right-body">
              <Dialog.Title className="join-title">Continue with your email</Dialog.Title>
              <Dialog.Description className="sr-only">
                Create your Fiverr account with an email and password.
              </Dialog.Description>

              <form className="join-form" onSubmit={handleSubmit}>
                <div className="join-fields">
                  <div className="join-field">
                    <label className="join-label" htmlFor="join-email">
                      Email
                    </label>
                    <div className="join-input-row">
                      <input
                        id="join-email"
                        className="join-input"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="name@email.com"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                      />
                    </div>
                  </div>

                  <div className="join-field">
                    <label className="join-label" htmlFor="join-password">
                      Password
                    </label>
                    <div className="join-input-row">
                      <input
                        id="join-password"
                        className="join-input"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                      />
                      <button
                        type="button"
                        className="join-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon slashed={!showPassword} />
                      </button>
                    </div>
                  </div>

                  <ul className="join-hints clean-list">
                    {PASSWORD_RULES.map((rule) => (
                      <li key={rule} className="join-hint">
                        <span className="join-hint-icon" aria-hidden="true">
                          <CheckCircleIcon />
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="join-form-actions">
                  <button
                    type="submit"
                    className={`join-continue ${canContinue ? 'is-active' : ''}`}
                    disabled={!canContinue}
                  >
                    Continue
                  </button>
                </div>
              </form>

              <p className="join-legal">
                By joining, you agree to the Fiverr{' '}
                <a className="join-link" href="#">
                  Terms of Service
                </a>{' '}
                and to occasionally receive emails from us. Please read our{' '}
                <a className="join-link" href="#">
                  Privacy Policy
                </a>{' '}
                to learn how we use your personal data.
              </p>
            </div>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.469 13.037 1.25 8.818m0 0L5.469 4.6M1.25 8.818h13.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function EyeIcon({ slashed }) {
  if (slashed) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 17"
        fill="none"
        aria-hidden="true"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M13.4 10.525c1.055-.972 1.35-2.025 1.35-2.025C13.738 6.475 11.165 3.775 8 3.775m3.375 8.382c-.968.62-2.106 1.068-3.375 1.068-3.165 0-5.737-2.7-6.75-4.725 0 0 1.013-2.025 3.037-3.43m2.267 2.08A1.977 1.977 0 1 0 9.35 9.946M1.925 2.425l12.15 12.15"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M1.25 8s2.25-4.5 6.75-4.5S14.75 8 14.75 8s-2.25 4.5-6.75 4.5S1.25 8 1.25 8"
      />
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m5.25 7.94 2.063 2.062 3.437-4.125m4 2.123a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function CheckSmallIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m1.25 9.306 3.92 3.92 9.58-10.452"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
