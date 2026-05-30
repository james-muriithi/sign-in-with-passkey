import {
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server'
import z from 'zod'
import { useValidateBody } from '../../utils/validate'
import db from '../../utils/db'

const verificationSchema = z.object({
  response: z.custom<RegistrationResponseJSON>(),
  passkeyName: z.string().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const session = await useAuthentication(event)
  const { response, passkeyName } = await useValidateBody(event, verificationSchema)

  const authSession = await useAuthSession(event)
  const challenge = authSession.data.registrationChallenge

  if (!challenge) {
    throw createError({ statusCode: 400, message: 'No active registration challenge' })
  }

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: useWebAuthnConfig().origin,
      expectedRPID: useWebAuthnConfig().rpID,
    })
  }
  catch {
    throw createError({ statusCode: 400, message: 'Verification failed' })
  }

  const { verified, registrationInfo } = verification

  if (!verified || !registrationInfo) {
    throw createError({ statusCode: 400, message: 'Verification failed' })
  }

  const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo

  // Clear the used challenge from the session
  await authSession.update({ ...authSession.data, registrationChallenge: undefined })

  await db.passkey.create({
      data: {
        userId: session.userId,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: credential.counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: credential.transports ?? [],
        name: passkeyName ?? null,
      },
    })

  return { verified: verification.verified }
})

