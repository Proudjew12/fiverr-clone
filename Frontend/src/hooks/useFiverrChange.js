import { useMemo, useState, useCallback, cloneElement, isValidElement } from 'react'

export function useFiverrChange({ children }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('language')

  const close = useCallback(() => {
    setOpen(false)
    setTab('language')
  }, [])

  // Prevent AppHeader document mousedown handler from firing
  const stopHeaderOutsideClose = useCallback((ev) => {
    ev.stopPropagation()
  }, [])

  const triggerEl = useMemo(() => {
    if (!isValidElement(children)) return children

    return cloneElement(children, {
      onMouseDownCapture: (ev) => {
        stopHeaderOutsideClose(ev)
        children.props?.onMouseDownCapture?.(ev)
      },
    })
  }, [children, stopHeaderOutsideClose])

  const languages = useMemo(
    () => [
      'English',
      'Deutsch',
      'Español',
      'Français',
      'Português',
      'Italiano',
      'Nederlands',
    ],
    []
  )

  const currencies = useMemo(
    () => [
      { code: 'USD', name: 'United States Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
      { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
      { code: 'SEK', name: 'Swedish Krona', symbol: 'SEK' },
      { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
      { code: 'SGD', name: 'Singapore Dollar', symbol: 'SGD' },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
      { code: 'ZAR', name: 'South African Rand', symbol: 'ZAR' },
      { code: 'CNY', name: 'Chinese Renminbi Yuan', symbol: 'CN¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'MYR' },
      { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
      { code: 'PKR', name: 'Pakistani Rupee', symbol: 'PKR' },
      { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
      { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
      { code: 'THB', name: 'Thai Baht', symbol: 'THB' },
      { code: 'TRY', name: 'Turkish New Lira', symbol: 'TRY' },
      { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'AED' },
    ],
    []
  )

  return {
    // state
    open,
    setOpen,
    tab,
    setTab,

    // data
    languages,
    currencies,

    // behavior
    close,
    stopHeaderOutsideClose,
    triggerEl,
  }
}
