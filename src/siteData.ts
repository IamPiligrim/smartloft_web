export const PHONE_DISPLAY = '+7 977 799-20-43'
export const PHONE_TEL = '+79777992043'
export const PHONE_WA = '79777992043'
export const EMAIL = 'smartloftsmoscow@gmail.com'
export const TELEGRAM_HANDLE = '@smart_lofts_moscow'
export const TELEGRAM_URL = 'https://t.me/smart_lofts_moscow'

export type Location = {
  id: string
  address: string
  metro: string
  lat: number
  lon: number
}

export const LOCATIONS: Location[] = [
  { id: 'dobrolyubova', address: 'ул. Добролюбова, 8к2', metro: 'м. Бутырская', lat: 55.81124, lon: 37.595491 },
  { id: 'novodmitrovskaya', address: 'ул. Новодмитровская, 2к5', metro: 'м. Дмитровская', lat: 55.803828, lon: 37.591005 },
  { id: 'volokolamskoe-24', address: 'Волоколамское ш., 24', metro: 'МЦК Стрешнево', lat: 55.812033, lon: 37.485529 },
  { id: 'ozerova', address: 'ул. Николая Озерова, 8к1', metro: 'м. Спартак', lat: 55.815031, lon: 37.428015 },
  { id: 'volokolamskoe-71', address: 'Волоколамское ш., 71/22к2', metro: 'м. Спартак', lat: 55.821958, lon: 37.437571 },
  { id: 'dmitrovskiy', address: 'Дмитровский пр-д, 1', metro: 'м. Дмитровская', lat: 55.808938, lon: 37.578648 },
  { id: 'botanicheskaya', address: 'ул. Ботаническая, 33Вс1', metro: 'м. Петровско-Разумовская', lat: 55.840318, lon: 37.582807 },
  { id: 'baumanskaya', address: 'ул. Бауманская, 58/3с2', metro: 'м. Бауманская', lat: 55.768338, lon: 37.679209 },
]

export type ContactMethod = {
  icon: string
  label: string
  value: string
  note: string
  href: string
}

export const CONTACT_METHODS: ContactMethod[] = [
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

export function osmEmbedSrc(lat: number, lon: number) {
  const dLon = 0.0085
  const dLat = 0.005
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
}
