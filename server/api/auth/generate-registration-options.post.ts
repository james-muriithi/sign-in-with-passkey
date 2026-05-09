import { generateRegistrationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import db from '../../utils/db'

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

  // Store the challenge in the auth session (lives for the session duration;
  // verify-registration reads and clears it)
  const authSession = await useAuthSession(event)
  await authSession.update({ ...authSession.data, registrationChallenge: options.challenge })

  return options
})
