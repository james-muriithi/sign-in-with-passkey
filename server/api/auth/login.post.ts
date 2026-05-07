import bcrypt from 'bcryptjs'
import z from 'zod'
import { useValidateBody } from '../../utils/validate'
import { setAuthSession } from '../../utils/session'
import db from '../../utils/db'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await useValidateBody(event, loginSchema)

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, passwordHash: true },
  })

  // Use a constant-time compare to avoid leaking whether the email exists
  const validPassword = user
    ? await bcrypt.compare(password, user.passwordHash)
    : await bcrypt.compare(password, '$2b$12$invalidhashfortimingprotection000000000000000000000000')

  if (!user || !validPassword) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  await setAuthSession(event, { userId: user.id, email: user.email })

  return {
    user: { id: user.id, email: user.email, name: user.name },
  }
})
