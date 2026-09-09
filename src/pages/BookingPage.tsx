import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import loungePhoto from '../assets/photos/loft-lounge.webp'
import { EMAIL, LOCATIONS, PHONE_DISPLAY, PHONE_TEL, PHONE_WA } from '../siteData'
import './BookingPage.css'

const APARTMENT_TYPES = ['Студия', '1-комнатные апартаменты', '2-комнатные апартаменты', '3-комнатные апартаменты', '4-комнатные апартаменты']

const DISCOUNT_TIERS = [
  { nights: 30, percent: 25 },
  { nights: 14, percent: 20 },
  { nights: 7, percent: 15 },
  { nights: 3, percent: 9 },
]

function pluralizeNights(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'ночи'
  return 'ночей'
}

function discountFor(nights: number) {
  return DISCOUNT_TIERS.find((tier) => nights >= tier.nights) ?? null
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDate(iso: string) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

const today = new Date()
const defaultCheckin = toISODate(today)
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const defaultCheckout = toISODate(tomorrow)

function BookingPage() {
  useEffect(() => {
    document.title = 'Smart Lofts Moscow — бронирование'
  }, [])

  const [locationId, setLocationId] = useState('any')
  const [apartmentType, setApartmentType] = useState(APARTMENT_TYPES[0])
  const [checkin, setCheckin] = useState(defaultCheckin)
  const [checkout, setCheckout] = useState(defaultCheckout)
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const checkinId = useId()
  const checkoutId = useId()
  const locationSelectId = useId()
  const typeSelectId = useId()
  const guestsId = useId()
  const nameId = useId()
  const phoneId = useId()
  const commentId = useId()

  function handleCheckinChange(value: string) {
    setCheckin(value)
    if (checkout && value >= checkout) {
      const next = new Date(`${value}T00:00:00`)
      next.setDate(next.getDate() + 1)
      setCheckout(toISODate(next))
    }
  }

  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0
    const inDate = new Date(`${checkin}T00:00:00`)
    const outDate = new Date(`${checkout}T00:00:00`)
    const diff = Math.round((outDate.getTime() - inDate.getTime()) / 86_400_000)
    return diff > 0 ? diff : 0
  }, [checkin, checkout])

  const discount = nights > 0 ? discountFor(nights) : null

  const locationLabel = locationId === 'any' ? null : LOCATIONS.find((location) => location.id === locationId)?.address ?? null

  const whatsappHref = useMemo(() => {
    const lines = [
      'Здравствуйте! Хочу забронировать апартаменты.',
      `Тип: ${apartmentType}.`,
      locationLabel ? `Адрес: ${locationLabel}.` : null,
      nights > 0
        ? `Даты: ${formatDate(checkin)} — ${formatDate(checkout)} (${nights} ${pluralizeNights(nights)}${discount ? `, скидка ${discount.percent}%` : ''}).`
        : null,
      `Гостей: ${guests}.`,
      `Имя: ${name.trim() || '—'}.`,
      phone.trim() ? `Телефон: ${phone.trim()}.` : null,
      comment.trim() || null,
    ].filter(Boolean)
    return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(lines.join(' '))}`
  }, [apartmentType, locationLabel, nights, checkin, checkout, discount, guests, name, phone, comment])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
    window.open(whatsappHref, '_blank', 'noopener')
  }

  return (
    <>
      <section className="booking-hero">
        <div className="wrap booking-hero__grid">
          <div>
            <h1 className="booking-hero__heading">Заезжайте в любое время — заселение бесконтактное, 24/7</h1>
            <p className="booking-hero__lead">
              Выберите даты и апартаменты — соберём заявку и откроем WhatsApp с готовым сообщением. Бронь
              подтверждается предоплатой за первые сутки проживания.
            </p>
            <a className="button button--primary" href="#booking-form">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#icon-calendar" />
              </svg>
              Перейти к форме
            </a>
          </div>
          <img className="booking-hero__photo" src={loungePhoto} alt="Гостиная в одном из лофтов Smart Lofts Moscow" />
        </div>
      </section>

      <section className="discounts" aria-labelledby="discounts-heading">
        <div className="wrap">
          <div className="section-head">
            <h2 id="discounts-heading">Чем дольше живёте, тем выгоднее</h2>
            <p>Скидка считается от длительности проживания и применяется автоматически при подтверждении брони.</p>
          </div>

          <ul className="row-list">
            {[...DISCOUNT_TIERS].reverse().map((tier) => (
              <li className="row-list__row" key={tier.nights}>
                <span className="row-list__icon">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-percent" />
                  </svg>
                </span>
                <span className="row-list__text">
                  <span className="row-list__label">
                    {tier.nights}+ {pluralizeNights(tier.nights)}
                  </span>
                  <span className="row-list__note">Скидка действует на весь период проживания</span>
                </span>
                <span className="row-list__value row-list__value--static">−{tier.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="booking-form-section" id="booking-form" aria-labelledby="booking-form-heading">
        <div className="wrap split-grid">
          <div className="info-aside">
            <h2 id="booking-form-heading">Оставить заявку на бронирование</h2>
            <p>
              Заполните форму — мы проверим даты, посчитаем скидку и подтвердим бронь. Данные никуда не
              сохраняются: сообщение уходит напрямую в WhatsApp.
            </p>

            <div className="info-aside__facts">
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-key" />
                </svg>
                <span>Бесконтактное заселение, доступно 24/7</span>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-card" />
                </svg>
                <span>Предоплата за 1 сутки подтверждает бронь</span>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-phone" />
                </svg>
                <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-mail" />
                </svg>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
          </div>

          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="form-panel__row">
              <div className="form-field">
                <label htmlFor={checkinId}>Заезд</label>
                <input
                  id={checkinId}
                  name="checkin"
                  type="date"
                  min={defaultCheckin}
                  value={checkin}
                  onChange={(event) => handleCheckinChange(event.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor={checkoutId}>Выезд</label>
                <input
                  id={checkoutId}
                  name="checkout"
                  type="date"
                  min={checkin || defaultCheckin}
                  value={checkout}
                  onChange={(event) => setCheckout(event.target.value)}
                  required
                />
              </div>
            </div>

            {nights > 0 && (
              <p className="booking-summary" role="status">
                {nights} {pluralizeNights(nights)}
                {discount ? ` · скидка ${discount.percent}%` : ''}
              </p>
            )}

            <div className="form-panel__row">
              <div className="form-field">
                <label htmlFor={locationSelectId}>Апартаменты</label>
                <select id={locationSelectId} name="location" value={locationId} onChange={(event) => setLocationId(event.target.value)}>
                  <option value="any">Любые свободные</option>
                  {LOCATIONS.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor={typeSelectId}>Тип апартаментов</label>
                <select id={typeSelectId} name="apartmentType" value={apartmentType} onChange={(event) => setApartmentType(event.target.value)}>
                  {APARTMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={guestsId}>Гостей</label>
              <input
                id={guestsId}
                name="guests"
                type="number"
                min={1}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                required
              />
            </div>

            <div className="form-panel__row">
              <div className="form-field">
                <label htmlFor={nameId}>Имя</label>
                <input id={nameId} name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" required />
              </div>
              <div className="form-field">
                <label htmlFor={phoneId}>Телефон</label>
                <input id={phoneId} name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 999 000-00-00" required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={commentId}>Комментарий</label>
              <textarea id={commentId} name="comment" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ранний заезд, поздний выезд — что важно знать заранее" />
            </div>

            <button className="button button--primary form-submit" type="submit">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#icon-whatsapp" />
              </svg>
              Отправить заявку в WhatsApp
            </button>

            <p className="form-hint" role="status">
              {sent
                ? 'Открыли WhatsApp с готовым сообщением — подтвердите отправку там.'
                : 'Мы не сохраняем эти данные — сообщение уходит напрямую в WhatsApp.'}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

export default BookingPage
