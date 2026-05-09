import {
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
  type AuthenticatorTransportFuture,
} from '@simplewebauthn/server'
import z from 'zod'
import { useValidateBody } from '../../utils/validate'
import db from '../../utils/db'

const schema = z.object({
  response: z.custom<AuthenticationResponseJSON>(),
})

export default defineEventHandler(async (event) => {
  const { response } = await useValidateBody(event, schema)

  // Retrieve the challenge stored during options generation
  const challengeSession = await useSession(event, {
    name: 'auth-challenge',
    password: useRuntimeConfig(event).sessionSecret,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })

  const { challenge } = challengeSession.data
  if (!challenge) {
    throw createError({ statusCode: 400, message: 'No active challenge' })
  }

  // Look up the passkey by the credential ID in the response
  const passkey = await db.passkey.findUnique({
    where: { credentialId: response.id },
    include: { user: true },
  })

  if (!passkey) {
    throw createError({ statusCode: 400, message: 'Passkey not found' })
  }

  const { rpID, origin } = useWebAuthnConfig()

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.credentialId,
        publicKey: new Uint8Array(passkey.publicKey),
        counter: Number(passkey.counter),
        transports: passkey.transports as AuthenticatorTransportFuture[],
      },
    })
  }
  catch {
    throw createError({ statusCode: 400, message: 'Authentication failed' })
  }

  if (!verification.verified) {
    throw createError({ statusCode: 400, message: 'Authentication failed' })
  }

  // Update counter and last-used timestamp
  await db.passkey.update({
    where: { credentialId: passkey.credentialId },
    data: {
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date(),
    },
  })

  // Consume the challenge
  await challengeSession.clear()

  // Establish the auth session
  await setAuthSession(event, { userId: passkey.user.id, email: passkey.user.email })

  return {
    user: {
      id: passkey.user.id,
      email: passkey.user.email,
      name: passkey.user.name,
    },
  }
})
