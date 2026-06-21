import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
