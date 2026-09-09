import { useId, useMemo, useState, type FormEvent } from 'react'
import skylinePhoto from './assets/photos/loft-skyline.webp'
import diningPhoto from './assets/photos/loft-dining.webp'
import breakfastPhoto from './assets/photos/loft-breakfast.webp'
import loungePhoto from './assets/photos/loft-lounge.webp'
import './App.css'

const PHONE_DISPLAY = '+7 977 799-20-43'
const PHONE_TEL = '+79777992043'
const PHONE_WA = '79777992043'
const EMAIL = 'smartloftsmoscow@gmail.com'
const TELEGRAM_HANDLE = '@smart_lofts_moscow'
const TELEGRAM_URL = 'https://t.me/smart_lofts_moscow'

type Location = {
  id: string
  address: string
  metro: string
  lat: number
  lon: number
}

const LOCATIONS: Location[] = [
  { id: 'dobrolyubova', address: 'ул. Добролюбова, 8к2', metro: 'м. Бутырская', lat: 55.81124, lon: 37.595491 },
  { id: 'novodmitrovskaya', address: 'ул. Новодмитровская, 2к5', metro: 'м. Дмитровская', lat: 55.803828, lon: 37.591005 },
  { id: 'volokolamskoe-24', address: 'Волоколамское ш., 24', metro: 'МЦК Стрешнево', lat: 55.812033, lon: 37.485529 },
  { id: 'ozerova', address: 'ул. Николая Озерова, 8к1', metro: 'м. Спартак', lat: 55.815031, lon: 37.428015 },
  { id: 'volokolamskoe-71', address: 'Волоколамское ш., 71/22к2', metro: 'м. Спартак', lat: 55.821958, lon: 37.437571 },
  { id: 'dmitrovskiy', address: 'Дмитровский пр-д, 1', metro: 'м. Дмитровская', lat: 55.808938, lon: 37.578648 },
  { id: 'botanicheskaya', address: 'ул. Ботаническая, 33Вс1', metro: 'м. Петровско-Разумовская', lat: 55.840318, lon: 37.582807 },
  { id: 'baumanskaya', address: 'ул. Бауманская, 58/3с2', metro: 'м. Бауманская', lat: 55.768338, lon: 37.679209 },
]

type ContactMethod = {
  icon: string
  label: string
  value: string
  note: string
  href: string
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: 'icon-phone',
    label: 'Позвонить',
    value: PHONE_DISPLAY,
    note: 'Ежедневно, с 8:00 до 22:00',
    href: `tel:${PHONE_TEL}`,
  },
  {
    icon: 'icon-whatsapp',
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    note: 'Обычно отвечаем в течение 15 минут',
    href: `https://wa.me/${PHONE_WA}`,
  },
  {
    icon: 'icon-telegram',
    label: 'Telegram',
    value: TELEGRAM_HANDLE,
    note: 'Удобно для переписки и файлов',
    href: TELEGRAM_URL,
  },
  {
    icon: 'icon-mail',
    label: 'Email',
    value: EMAIL,
    note: 'Для документов и официальных вопросов',
    href: `mailto:${EMAIL}`,
  },
]

function osmEmbedSrc(lat: number, lon: number) {
  const dLon = 0.0085
  const dLat = 0.005
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
}

function App() {
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
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>

      <header className="site-header">
        <div className="wrap site-header__row">
          <a className="logo" href="#top" aria-label="Smart Lofts Moscow, на главную">
            <span className="logo__word">smart</span>
            <span className="logo__word logo__word--accent">
              lofts
              <svg className="logo__heart" role="presentation" aria-hidden="true">
                <use href="/icons.svg#icon-heart" />
              </svg>
            </span>
            <span className="logo__word">moscow</span>
          </a>

          <nav className="site-nav" aria-label="Разделы страницы">
            <a href="#methods">Связь</a>
            <a href="#locations">Адреса</a>
            <a href="#form">Заявка</a>
          </nav>

          <a className="button button--ghost site-header__cta" href={`tel:${PHONE_TEL}`} aria-label={`Позвонить: ${PHONE_DISPLAY}`}>
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#icon-phone" />
            </svg>
            <span className="site-header__cta-label">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      <main id="main">
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
                  <a className="button button--primary" href={`https://wa.me/${PHONE_WA}`}>
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#icon-whatsapp" />
                    </svg>
                    Написать в WhatsApp
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

            <ul className="method-list">
              {CONTACT_METHODS.map((method) => (
                <li className="method-row" key={method.label}>
                  <span className="method-row__icon">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href={`/icons.svg#${method.icon}`} />
                    </svg>
                  </span>
                  <span className="method-row__text">
                    <span className="method-row__label">{method.label}</span>
                    <span className="method-row__note">{method.note}</span>
                  </span>
                  <a className="method-row__value" href={method.href}>
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
          <div className="wrap request__grid">
            <div className="request__aside">
              <h2 id="request-heading">Оставить заявку</h2>
              <p>
                Расскажите, что вам нужно, — соберём сообщение и откроем WhatsApp с готовым текстом. Останется
                нажать «отправить» в самом мессенджере.
              </p>

              <div className="request__facts">
                <div className="request__fact">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-clock" />
                  </svg>
                  <span>Отвечаем ежедневно, 8:00–22:00</span>
                </div>
                <div className="request__fact">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#icon-mail" />
                  </svg>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>

              <img className="request__photo" src={loungePhoto} alt="Гостиная в одном из лофтов Smart Lofts Moscow" />
            </div>

            <form className="request-form" onSubmit={handleSubmit}>
              <div className="request-form__field">
                <label htmlFor={nameId}>Имя</label>
                <input id={nameId} name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" required />
              </div>

              <div className="request-form__field">
                <label htmlFor={phoneId}>Телефон для связи</label>
                <input id={phoneId} name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 999 000-00-00" required />
              </div>

              <div className="request-form__field">
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

              <div className="request-form__field">
                <label htmlFor={commentId}>Комментарий</label>
                <textarea id={commentId} name="comment" rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Даты заезда, число гостей — что важно знать заранее" />
              </div>

              <button className="button button--primary request-form__submit" type="submit">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-whatsapp" />
                </svg>
                Отправить в WhatsApp
              </button>

              <p className="request-form__hint" role="status">
                {sent
                  ? 'Открыли WhatsApp с готовым сообщением — подтвердите отправку там.'
                  : 'Мы не сохраняем эти данные — сообщение уходит напрямую в WhatsApp.'}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__grid">
          <div>
            <a className="logo logo--footer" href="#top" aria-label="Smart Lofts Moscow, на главную">
              <span className="logo__word">smart</span>
              <span className="logo__word logo__word--accent">
                lofts
                <svg className="logo__heart" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#icon-heart" />
                </svg>
              </span>
              <span className="logo__word">moscow</span>
            </a>
            <p className="site-footer__tag">Сервисные апартаменты в восьми районах Москвы</p>
          </div>

          <ul className="site-footer__contacts">
            <li>
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <a href={TELEGRAM_URL}>{TELEGRAM_HANDLE}</a>
            </li>
          </ul>

          <p className="site-footer__copy">© {new Date().getFullYear()} Smart Lofts Moscow</p>
        </div>
      </footer>
    </>
  )
}

export default App
