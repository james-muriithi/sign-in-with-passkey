
import bcrypt from 'bcryptjs'
import z from 'zod'
import { useValidateBody } from '../../utils/validate'
import { setAuthSession } from '../../utils/session'
import db from '../../utils/db'

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const { name, email, password } = await useValidateBody(event, signupSchema)

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already in use' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { name, email, passwordHash },
    select: { id: true, email: true, name: true },
  })

  await setAuthSession(event, { userId: user.id, email: user.email })

  return { user }
})
