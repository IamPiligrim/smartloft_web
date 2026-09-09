import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ContactsPage from './pages/ContactsPage'
import BookingPage from './pages/BookingPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ContactsPage />} />
        <Route path="booking" element={<BookingPage />} />
      </Route>
    </Routes>
  )
}

export default App
