import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id:    string
  name:  string | null
  email: string | null
  role:  string
  image?: string | null
}

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireSession() {
  const session = await getSession()
  if (!session?.user) redirect('/admin/login')
  return session.user as SessionUser
}

export async function requireAdmin() {
  const user = await requireSession()
  const adminRoles = ['SUPER_ADMIN', 'ADMIN']
  if (!adminRoles.includes(user.role)) redirect('/')
  return user
}

export async function requireAgent() {
  const user = await requireSession()
  const allowed = ['SUPER_ADMIN', 'ADMIN', 'AGENT']
  if (!allowed.includes(user.role)) redirect('/')
  return user
}

export function isAdminRole(role: string) {
  return ['SUPER_ADMIN', 'ADMIN'].includes(role)
}
