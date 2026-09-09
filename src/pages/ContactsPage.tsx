import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import skylinePhoto from '../assets/photos/loft-skyline.webp'
import diningPhoto from '../assets/photos/loft-dining.webp'
import breakfastPhoto from '../assets/photos/loft-breakfast.webp'
import loungePhoto from '../assets/photos/loft-lounge.webp'
import { CONTACT_METHODS, EMAIL, LOCATIONS, PHONE_TEL, PHONE_DISPLAY, PHONE_WA, TELEGRAM_URL, osmEmbedSrc } from '../siteData'
import './ContactsPage.css'

function ContactsPage() {
  useEffect(() => {
    document.title = 'Smart Lofts Moscow — контакты'
  }, [])

  const [activeLocationId, setActiveLocationId] = useState(LOCATIONS[0].id)
  const activeLocation = useMemo(
    () => LOCATIONS.find((location) => location.id === activeLocationId) ?? LOCATIONS[0],
    [activeLocationId],
  )

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [requestLocationId, setRequestLocationId] = useState('any')
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const nameId = useId()
  const phoneId = useId()
  const locationSelectId = useId()
  const commentId = useId()

  const requestLocationLabel =
    requestLocationId === 'any'
      ? 'любые свободные апартаменты'
      : LOCATIONS.find((location) => location.id === requestLocationId)?.address ?? 'любые свободные апартаменты'

  const whatsappHref = useMemo(() => {
    const lines = [
      `Здравствуйте! Меня зовут ${name.trim() || '—'}.`,
      phone.trim() ? `Мой телефон: ${phone.trim()}.` : null,
      `Интересуют апартаменты: ${requestLocationLabel}.`,
      comment.trim() || null,
    ].filter(Boolean)
    return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(lines.join(' '))}`
  }, [name, phone, requestLocationLabel, comment])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
    window.open(whatsappHref, '_blank', 'noopener')
  }

  return (
    <>
      <section className="hero" id="top">
        <div className="wrap hero__grid">
          <div className="hero__intro">
            <h1 className="hero__heading">Смарт-лофты в восьми районах Москвы</h1>
            <p className="hero__lead">
              Заселение, продление и любые вопросы по брони — по телефону, в мессенджере или у администратора на
              месте. Мы на связи каждый день, с 8:00 до 22:00.
            </p>

            <div className="hero__contact">
              <a className="hero__phone" href={`tel:${PHONE_TEL}`}>
                {PHONE_DISPLAY}
              </a>
              <p className="hero__phone-note">Позвоните — и мы подберём свободный лофт рядом с нужным метро</p>

              <div className="hero__actions">
                <Link className="button button--primary" to="/booking">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-calendar" />
                  </svg>
                  Забронировать
                </Link>
                <a className="button button--outline" href={`https://wa.me/${PHONE_WA}`}>
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-whatsapp" />
                  </svg>
                  WhatsApp
                </a>
                <a className="button button--outline" href={TELEGRAM_URL}>
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-telegram" />
                  </svg>
                  Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="hero__gallery" aria-hidden="true">
            <img className="hero__photo hero__photo--a" src={skylinePhoto} alt="" width="1152" height="768" />
            <img className="hero__photo hero__photo--b" src={diningPhoto} alt="" width="1152" height="768" />
            <img className="hero__photo hero__photo--c" src={breakfastPhoto} alt="" width="1152" height="768" />
          </div>
        </div>
      </section>

      <section className="methods" id="methods" aria-labelledby="methods-heading">
        <div className="wrap">
          <div className="section-head">
            <h2 id="methods-heading">Как удобнее всего написать</h2>
            <p>Выбирайте канал, которым пользуетесь каждый день, — отвечает один и тот же человек.</p>
          </div>

          <ul className="row-list">
            {CONTACT_METHODS.map((method) => (
              <li className="row-list__row" key={method.label}>
                <span className="row-list__icon">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href={`/icons.svg#${method.icon}`} />
                  </svg>
                </span>
                <span className="row-list__text">
                  <span className="row-list__label">{method.label}</span>
                  <span className="row-list__note">{method.note}</span>
                </span>
                <a className="row-list__value" href={method.href}>
                  {method.value}
                  <svg className="icon icon--sm" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-arrow" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="locations" id="locations" aria-labelledby="locations-heading">
        <div className="wrap">
          <div className="section-head">
            <h2 id="locations-heading">Адреса апартаментов</h2>
            <p>Восемь домов в разных концах Москвы. Выберите адрес, чтобы увидеть его на карте.</p>
          </div>

          <div className="locations__grid">
            <ul className="location-list" role="list">
              {LOCATIONS.map((location) => {
                const isActive = location.id === activeLocationId
                return (
                  <li key={location.id}>
                    <button
                      type="button"
                      className={`location-row${isActive ? ' location-row--active' : ''}`}
                      onClick={() => setActiveLocationId(location.id)}
                      aria-pressed={isActive}
                    >
                      <svg className="icon" role="presentation" aria-hidden="true">
                        <use href="/icons.svg#icon-pin" />
                      </svg>
                      <span className="location-row__text">
                        <span className="location-row__address">{location.address}</span>
                        <span className="location-row__metro">{location.metro}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="location-map">
              <div className="location-map__frame">
                <iframe
                  key={activeLocation.id}
                  title={`Карта: ${activeLocation.address}`}
                  src={osmEmbedSrc(activeLocation.lat, activeLocation.lon)}
                  loading="lazy"
                />
              </div>
              <div className="location-map__footer">
                <span className="location-map__address">
                  {activeLocation.address} · {activeLocation.metro}
                </span>
                <a
                  className="location-map__link"
                  href={`https://yandex.ru/maps/?pt=${activeLocation.lon},${activeLocation.lat}&z=16&l=map`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть в Яндекс Картах
                  <svg className="icon icon--sm" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-arrow" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="request" id="form" aria-labelledby="request-heading">
        <div className="wrap split-grid">
          <div className="info-aside">
            <h2 id="request-heading">Остались вопросы?</h2>
            <p>
              Расскажите, что вам нужно, — соберём сообщение и откроем WhatsApp с готовым текстом. Останется
              нажать «отправить» в самом мессенджере. Для бронирования дат удобнее{' '}
              <Link to="/booking">отдельная форма бронирования</Link>.
            </p>

            <div className="info-aside__facts">
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-clock" />
                </svg>
                <span>Отвечаем ежедневно, 8:00–22:00</span>
              </div>
              <div className="info-aside__fact">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-mail" />
                </svg>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>

            <img className="info-aside__photo" src={loungePhoto} alt="Гостиная в одном из лофтов Smart Lofts Moscow" />
          </div>

          <form className="form-panel" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor={nameId}>Имя</label>
              <input id={nameId} name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" required />
            </div>

            <div className="form-field">
              <label htmlFor={phoneId}>Телефон для связи</label>
              <input id={phoneId} name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 999 000-00-00" required />
            </div>

            <div className="form-field">
              <label htmlFor={locationSelectId}>Апартаменты</label>
              <select id={locationSelectId} name="location" value={requestLocationId} onChange={(event) => setRequestLocationId(event.target.value)}>
                <option value="any">Любые свободные</option>
                {LOCATIONS.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor={commentId}>Комментарий</label>
              <textarea id={commentId} name="comment" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Что хотите уточнить" />
            </div>

            <button className="button button--primary form-submit" type="submit">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#icon-whatsapp" />
              </svg>
              Отправить в WhatsApp
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

export default ContactsPage
