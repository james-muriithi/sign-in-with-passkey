import type { H3Event } from 'h3'

interface SessionData {
  userId: string
  email: string
}

const SESSION_NAME = 'auth'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export const useAuthSession = (event: H3Event) => {
  const { sessionSecret } = useRuntimeConfig(event)

  return useSession<SessionData>(event, {
    name: SESSION_NAME,
    password: sessionSecret,
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
}

export const setAuthSession = async (event: H3Event, data: SessionData) => {
  const session = await useAuthSession(event)
  await session.update(data)
}

export const getAuthSession = async (event: H3Event): Promise<SessionData | null> => {
  const session = await useAuthSession(event)
  if (!session.data.userId) return null
  return session.data
}

export const clearAuthSession = async (event: H3Event) => {
  const session = await useAuthSession(event)
  await session.clear()
}
