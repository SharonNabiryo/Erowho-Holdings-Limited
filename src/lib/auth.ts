import { getServerSession } from 'next-auth'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user?.password) return null
          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null
          return { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image }
        } catch {
          // DB not connected — allow demo login
          if (credentials.email === 'admin@erowho.com' && credentials.password === 'demo1234') {
            return { id: 'demo', name: 'Admin', email: 'admin@erowho.com', role: 'SUPER_ADMIN', image: null }
          }
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID ? [
      GoogleProvider({
        clientId:     process.env.GOOGLE_CLIENT_ID     ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      }),
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production',
}

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
