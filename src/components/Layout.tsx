import { NavLink, Outlet, Link } from 'react-router-dom'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, TELEGRAM_HANDLE, TELEGRAM_URL } from '../siteData'
import '../styles/shared.css'

function Logo({ className = 'logo' }: { className?: string }) {
  return (
    <Link className={className} to="/" aria-label="Smart Lofts Moscow, на главную">
      <span className="logo__word">smart</span>
      <span className="logo__word logo__word--accent">
        lofts
        <svg className="logo__heart" role="presentation" aria-hidden="true">
          <use href="/icons.svg#icon-heart" />
        </svg>
      </span>
      <span className="logo__word">moscow</span>
    </Link>
  )
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'is-active' : undefined
}

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>

      <header className="site-header">
        <div className="wrap site-header__row">
          <Logo />

          <nav className="site-nav" aria-label="Разделы сайта">
            <NavLink to="/" end className={navLinkClass}>
              Контакты
            </NavLink>
            <NavLink to="/booking" className={navLinkClass}>
              Бронирование
            </NavLink>
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
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__grid">
          <div>
            <Logo className="logo logo--footer" />
            <p className="site-footer__tag">Сервисные апартаменты в восьми районах Москвы</p>
            <ul className="site-footer__nav">
              <li>
                <Link to="/">Контакты</Link>
              </li>
              <li>
                <Link to="/booking">Бронирование</Link>
              </li>
            </ul>
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

export default Layout
