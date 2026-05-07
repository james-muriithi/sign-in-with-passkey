import { generateRegistrationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import db from '../../utils/db'

const CHALLENGE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (event) => {
  const session = await useAuthentication(event)
  const { rpName, rpID } = useWebAuthnConfig()

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      passkeys: { select: { credentialId: true, transports: true } },
    },
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    userDisplayName: user.name,
    // Prevent re-registering a device that's already enrolled
    excludeCredentials: user.passkeys.map((key) => ({
      id: key.credentialId,
      transports: key.transports as AuthenticatorTransportFuture[],
    })),
  })

  // Delete any existing unused registration challenges for this user
  await db.challenge.deleteMany({
    where: { userId: user.id, type: 'registration' },
  })

  await db.challenge.create({
    data: {
      userId: user.id,
      challenge: options.challenge,
      type: 'registration',
      expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    },
  })

  return options
})
