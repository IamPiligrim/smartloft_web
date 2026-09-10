import { useEffect, useId, useMemo, useState, type FormEvent, type SyntheticEvent } from 'react'
import loungePhoto from '../assets/photos/loft-lounge.webp'
import { EMAIL, LOCATIONS, PHONE_DISPLAY, PHONE_TEL, PHONE_WA, iconHref } from '../siteData'
import './BookingPage.css'

const APARTMENT_TYPES = ['Студия', '1-комнатные апартаменты', '2-комнатные апартаменты', '3-комнатные апартаменты', '4-комнатные апартаменты']

const MIN_GUESTS = 1
const MAX_GUESTS = 8

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

function pluralizeGuests(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'гость'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'гостя'
  return 'гостей'
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
  const [promoCode, setPromoCode] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const checkinId = useId()
  const checkoutId = useId()
  const typeSelectId = useId()
  const guestsId = useId()
  const promoId = useId()
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

  function adjustGuests(delta: number) {
    setGuests((current) => Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, current + delta)))
  }

  function openDatePicker(event: SyntheticEvent<HTMLInputElement>) {
    const input = event.currentTarget
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
      } catch {
        // showPicker requires a direct user gesture in some browsers — ignore if it can't open.
      }
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
      promoCode.trim() ? `Промокод: ${promoCode.trim()}.` : null,
      `Имя: ${name.trim() || '—'}.`,
      phone.trim() ? `Телефон: ${phone.trim()}.` : null,
      comment.trim() || null,
    ].filter(Boolean)
    return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(lines.join(' '))}`
  }, [apartmentType, locationLabel, nights, checkin, checkout, discount, guests, promoCode, name, phone, comment])

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
              Выберите даты, апартаменты и число гостей — соберём заявку и откроем WhatsApp с готовым сообщением.
              Бронь подтверждается предоплатой за первые сутки проживания.
            </p>
            <a className="button button--primary" href="#booking-form">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href={iconHref('icon-calendar')} />
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
                    <use href={iconHref('icon-percent')} />
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
              Выберите апартаменты по фотографии, укажите даты и промокод, если он у вас есть — мы проверим
              наличие, посчитаем скидку и подтвердим бронь. Данные никуда не сохраняются: сообщение уходит
              напрямую в WhatsApp.
            </p>

            <div className="info-aside__facts">
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href={iconHref('icon-key')} />
                </svg>
                <span>Бесконтактное заселение, доступно 24/7</span>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href={iconHref('icon-card')} />
                </svg>
                <span>Предоплата за 1 сутки подтверждает бронь</span>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href={iconHref('icon-phone')} />
                </svg>
                <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href={iconHref('icon-mail')} />
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
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
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
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
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

            <div className="form-field">
              <label id={`${checkinId}-apartments-label`}>Апартаменты</label>
              <div className="apartment-picker" role="group" aria-labelledby={`${checkinId}-apartments-label`}>
                <button
                  type="button"
                  className={`apartment-card apartment-card--any${locationId === 'any' ? ' is-selected' : ''}`}
                  onClick={() => setLocationId('any')}
                  aria-pressed={locationId === 'any'}
                >
                  <span className="apartment-card__any-icon">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href={iconHref('icon-key')} />
                    </svg>
                  </span>
                  <span className="apartment-card__body">
                    <span className="apartment-card__address">Любые свободные</span>
                    <span className="apartment-card__metro">Подберём вариант под даты</span>
                  </span>
                  <span className="apartment-card__check" aria-hidden="true">
                    <svg className="icon icon--sm" role="presentation" aria-hidden="true">
                      <use href={iconHref('icon-check')} />
                    </svg>
                  </span>
                </button>

                {LOCATIONS.map((location) => {
                  const isActive = location.id === locationId
                  return (
                    <button
                      type="button"
                      key={location.id}
                      className={`apartment-card${isActive ? ' is-selected' : ''}`}
                      onClick={() => setLocationId(location.id)}
                      aria-pressed={isActive}
                    >
                      <img className="apartment-card__photo" src={location.photo} alt="" />
                      <span className="apartment-card__body">
                        <span className="apartment-card__address">{location.address}</span>
                        <span className="apartment-card__metro">{location.metro}</span>
                      </span>
                      <span className="apartment-card__check" aria-hidden="true">
                        <svg className="icon icon--sm" role="presentation" aria-hidden="true">
                          <use href={iconHref('icon-check')} />
                        </svg>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-panel__row">
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
              <div className="form-field">
                <label htmlFor={guestsId}>Гостей</label>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper__button"
                    onClick={() => adjustGuests(-1)}
                    disabled={guests <= MIN_GUESTS}
                    aria-label="Уменьшить количество гостей"
                  >
                    −
                  </button>
                  <input
                    id={guestsId}
                    className="stepper__input"
                    name="guests"
                    type="number"
                    inputMode="numeric"
                    min={MIN_GUESTS}
                    max={MAX_GUESTS}
                    value={guests}
                    onChange={(event) => {
                      const parsed = Number(event.target.value)
                      if (!Number.isNaN(parsed)) setGuests(Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, parsed)))
                    }}
                    aria-label={`${guests} ${pluralizeGuests(guests)}`}
                    required
                  />
                  <button
                    type="button"
                    className="stepper__button"
                    onClick={() => adjustGuests(1)}
                    disabled={guests >= MAX_GUESTS}
                    aria-label="Увеличить количество гостей"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={promoId}>Промокод</label>
              <input
                id={promoId}
                name="promo"
                type="text"
                autoComplete="off"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Если есть — впишите"
              />
              <span className="form-field__note">Необязательно. Администратор проверит и применит скидку при подтверждении.</span>
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
                <use href={iconHref('icon-whatsapp')} />
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
