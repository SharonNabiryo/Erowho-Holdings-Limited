import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader }  from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Erowho Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = { name: 'Admin', email: 'admin@erowho.com', role: 'SUPER_ADMIN', image: null }
  return (
    <div className="flex h-screen bg-slate-50 font-dm overflow-hidden">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
