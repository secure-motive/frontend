import { Outlet } from 'react-router'
import { AdminAuthProvider } from '../auth/AdminAuthContext'
import { AdminDataProvider } from '../context/AdminDataContext'
import { AdminToastProvider } from '../components/AdminToast'

export default function AdminRootWrapper() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <AdminToastProvider>
          <Outlet />
        </AdminToastProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
  )
}
