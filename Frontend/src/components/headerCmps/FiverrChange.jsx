import * as Dialog from '@radix-ui/react-dialog'
import { Formik } from 'formik'
import { useFiverrChange } from '@/hooks/useFiverrChange'

export function FiverrChange({
  children,
  initialLang = 'English',
  initialCurrency = 'USD',
  onSave,
}) {
  const {
    open,
    setOpen,
    tab,
    setTab,
    languages,
    currencies,
    close,
    stopHeaderOutsideClose,
    triggerEl,
  } = useFiverrChange({ children })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{triggerEl}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="prefs-overlay"
          onMouseDownCapture={stopHeaderOutsideClose}
        />

        <Dialog.Content
          className="prefs-modal grid"
          aria-label="Select your preferences"
          onMouseDownCapture={stopHeaderOutsideClose}
        >
          <Dialog.Description className="sr-only">
            Select your language and currency preferences.
          </Dialog.Description>

          <Formik
            initialValues={{ language: initialLang, currency: initialCurrency }}
            onSubmit={(values) => {
              onSave?.(values)
              close()
            }}
          >
            {({ values, setFieldValue, handleSubmit }) => (
              <>
                <header className="prefs-header grid">
                  <Dialog.Title className="prefs-title">
                    Select your preferences
                  </Dialog.Title>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="prefs-close"
                      aria-label="Close modal"
                      onMouseDownCapture={stopHeaderOutsideClose}
                    >
                      <span className="prefs-close-icon" aria-hidden="true">
                        ✕
                      </span>
                    </button>
                  </Dialog.Close>
                </header>

                <div className="prefs-body">
                  <ul className="prefs-tabs clean-list grid" role="tablist">
                    <li>
                      <button
                        type="button"
                        role="tab"
                        className={`prefs-tab ${tab === 'language' ? 'active' : ''}`}
                        aria-selected={tab === 'language'}
                        onClick={() => setTab('language')}
                      >
                        Language
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        role="tab"
                        className={`prefs-tab ${tab === 'currency' ? 'active' : ''}`}
                        aria-selected={tab === 'currency'}
                        onClick={() => setTab('currency')}
                      >
                        Currency
                      </button>
                    </li>
                  </ul>

                  {tab === 'language' && (
                    <section className="prefs-list" role="tabpanel" aria-label="Language">
                      {languages.map((lang) => {
                        const isSelected = values.language === lang
                        return (
                          <button
                            key={lang}
                            type="button"
                            className={`prefs-row grid ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => setFieldValue('language', lang)}
                          >
                            <span className="prefs-check-wrap" aria-hidden="true">
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="prefs-row-text">{lang}</span>
                          </button>
                        )
                      })}
                    </section>
                  )}

                  {tab === 'currency' && (
                    <section className="prefs-list" role="tabpanel" aria-label="Currency">
                      {currencies.map((c) => {
                        const isSelected = values.currency === c.code
                        return (
                          <button
                            key={c.code}
                            type="button"
                            className={`prefs-row grid ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => setFieldValue('currency', c.code)}
                          >
                            <span className="prefs-check-wrap" aria-hidden="true">
                              {isSelected ? '✓' : ''}
                            </span>

                            <span className="prefs-currency grid">
                              <span className="prefs-currency-name">{c.name}</span>
                              <span className="prefs-currency-code">
                                {c.code} - {c.symbol}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </section>
                  )}

                  <div className="prefs-actions grid">
                    <button type="button" className="prefs-save" onClick={handleSubmit}>
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
