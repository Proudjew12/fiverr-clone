import { gigService } from '@/services/leo.service.local.js'
import { utilService } from '@/services/util.service'
import demoData from '@/data/demo-data.json'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const ORDERS_STORAGE_KEY = 'orders'
const DEMO_CARD = demoData.payment.demoCard
const FALLBACK_THUMBS = demoData.fallbackThumbs

export function PaymentPage() {
  const { gigId } = useParams()
  const [gig, setGig] = useState(null)
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    displayName: '',
    saveCard: true,
  })

  const loadGig = useCallback(async () => {
    try {
      const data = await gigService.getById(gigId)
      setGig(data)
    } catch (err) {
      console.error('Failed to load gig for payment', err)
    }
  }, [gigId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (gigId) loadGig()
  }, [gigId, loadGig])

  const basePrice = Number(gig?.price || 165.09)
  const serviceFee = Number((basePrice * 0.125).toFixed(2))
  const subTotal = Number((basePrice + serviceFee).toFixed(2))
  const vat = Number((subTotal * 0.18).toFixed(2))
  const total = Number((subTotal + vat).toFixed(2))

  const formatMoney = (value) => `₪${Number(value).toFixed(2)}`

  function getPreviewImg() {
    const src = gig?.imgUrls?.[0]
    if (!src)
      return '/assets/Popular-Services/Video-Editing/img/0d93cdad-9c44-4d44-b3f2-6052d0faab17.png'
    const ext = String(src).split('.').pop().toLowerCase()
    if (['mp4', 'webm', 'ogg'].includes(ext)) {
      return '/assets/Popular-Services/Video-Editing/img/0d93cdad-9c44-4d44-b3f2-6052d0faab17.png'
    }
    return src
  }

  if (!gig) return <div className="payment-loading">Loading...</div>

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function onAutoFill() {
    setForm(DEMO_CARD)
  }

  async function onConfirmPay() {
    const previewImg = utilService.pickRandom(FALLBACK_THUMBS)
    const order = {
      id: utilService.makeId(),
      gigId,
      title: gig?.title || 'Gig',
      total,
      sellerName: gig?.owner?.fullname || 'Seller',
      createdAt: Date.now(),
      status: 'approved',
      previewImg,
    }
    const existing = utilService.loadFromStorage(ORDERS_STORAGE_KEY, [])
    utilService.saveToStorage(ORDERS_STORAGE_KEY, [order, ...existing])
    window.dispatchEvent(new CustomEvent('orders-updated'))

    await Swal.fire({
      title: 'Thank you for purchase',
      text: 'Your order was placed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    })
    window.location.assign('/dashboard')
  }

  return (
    <section className="payment-page">
      <div className="payment-topbar">
        <Link to="/" className="logo-header" aria-label="Go to homepage">
          <span className="site-logo-text">Leo</span>
        </Link>
      </div>
      <div className="payment-container">
        <div className="payment-main">
          <h1 className="payment-title">Order details</h1>

          <article className="order-card">
            <img className="order-thumb" src={getPreviewImg()} alt={gig.title} />
            <div className="order-info">
              <div className="order-title-row">
                <h2 className="order-title">{gig.title}</h2>
                <button
                  className="order-toggle"
                  type="button"
                  aria-label="Collapse order details"
                >
                  ˅
                </button>
              </div>
              <div className="order-meta">
                <span>Silver</span>
                <span>•</span>
                <span>{gig.daysToMake || 2} days delivery</span>
                <span>•</span>
                <span>3 revisions</span>
              </div>
              <div className="order-seller">
                <img
                  className="seller-avatar"
                  src={gig.owner?.imgUrl}
                  alt={gig.owner?.fullname}
                />
                <span className="seller-name">{gig.owner?.fullname}</span>
                <span className="seller-rating">★ {gig.owner?.rate || 4.8}</span>
                <span className="seller-level">Level {gig.owner?.level || 2}</span>
              </div>
            </div>
          </article>

          <section className="payment-methods">
            <h2 className="payment-section-title">Payment methods</h2>

            <div className="payment-card">
              <label className="payment-option">
                <input type="radio" name="payment-method" defaultChecked />
                <span className="option-label">Credit &amp; Debit Cards</span>
                <div className="card-badges">
                  <span>VISA</span>
                  <span>MC</span>
                  <span>AMEX</span>
                  <span>DISC</span>
                </div>
              </label>

              <div className="payment-form">
                <button type="button" className="demo-btn" onClick={onAutoFill}>
                  Autofill demo data
                </button>

                <label className="input-field">
                  <span>Card number</span>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={handleFormChange}
                    />
                    <span className="input-icon">🔒</span>
                  </div>
                </label>

                <div className="input-row">
                  <label className="input-field">
                    <span>Expiration date</span>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM / YY"
                      value={form.expiry}
                      onChange={handleFormChange}
                    />
                  </label>
                  <label className="input-field">
                    <span>Security code</span>
                    <input
                      type="text"
                      name="cvc"
                      placeholder="123"
                      value={form.cvc}
                      onChange={handleFormChange}
                    />
                  </label>
                </div>

                <label className="input-field">
                  <span>Cardholder's name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="As written on card"
                    value={form.name}
                    onChange={handleFormChange}
                  />
                </label>

                <label className="input-field">
                  <span>Card display name (Optional)</span>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="e.g. Marketing card, Legal team card..."
                    value={form.displayName}
                    onChange={handleFormChange}
                  />
                  <span className="input-hint">0/30</span>
                </label>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={form.saveCard}
                    onChange={handleFormChange}
                  />
                  <span>Save this card for future payments</span>
                </label>
              </div>
            </div>

            <div className="payment-card payment-card--compact">
              <label className="payment-option">
                <input type="radio" name="payment-method" />
                <span className="option-label">PayPal</span>
              </label>
            </div>

            <button type="button" className="promo-btn">
              + Apply promo code
            </button>
          </section>

          <section className="billing-info">
            <div className="billing-header">
              <h2>Billing information</h2>
              <button type="button" className="link-btn">
                Add details
              </button>
            </div>
            <p className="billing-name">RichMan</p>
            <p className="billing-country">Israel</p>
          </section>

          <section className="trust-row">
            <div>
              <h3>We've got your back</h3>
              <p>Your payment will be held by Fiverr until your order is completed.</p>
            </div>
            <div>
              <h3>100% secure payments</h3>
              <p>Your financial information is protected.</p>
            </div>
            <div>
              <h3>Questions about payments?</h3>
              <p className="link-text">Explore our FAQs</p>
            </div>
          </section>
        </div>

        <aside className="payment-summary">
          <div className="summary-card">
            <div className="summary-header">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <button className="summary-pay-btn" type="button" onClick={onConfirmPay}>
              Confirm &amp; Pay
            </button>
            <p className="summary-terms">
              By clicking the button, you agree to Fiverr's{' '}
              <span className="link-text">Terms of Service</span> and{' '}
              <span className="link-text">Payment Terms</span>
            </p>
            <div className="summary-safe">
              <span className="safe-icon">🔒</span> Safe and secure payment
            </div>
            <div className="summary-divider" />
            <h3 className="summary-title">Price summary</h3>
            <div className="summary-line">
              <span>Selected package</span>
              <span>{formatMoney(basePrice)}</span>
            </div>
            <div className="summary-line">
              <span>Service fee</span>
              <span>{formatMoney(serviceFee)}</span>
            </div>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatMoney(subTotal)}</span>
            </div>
            <div className="summary-line">
              <span>VAT</span>
              <span>{formatMoney(vat)}</span>
            </div>
            <div className="summary-line summary-total">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
