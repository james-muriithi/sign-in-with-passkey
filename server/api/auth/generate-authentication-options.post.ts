import { generateAuthenticationOptions } from '@simplewebauthn/server'

const CHALLENGE_TTL_SECONDS = 5 * 60 // 5 minutes

export default defineEventHandler(async (event) => {
  const { rpID } = useWebAuthnConfig()

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    // No allowCredentials → discoverable credential; the authenticator presents
    // the available accounts to the user.
  })

  // Store the challenge in a short-lived session cookie (no user yet)
  const challengeSession = await useSession(event, {
    name: 'auth-challenge',
    password: useRuntimeConfig(event).sessionSecret,
    maxAge: CHALLENGE_TTL_SECONDS,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
  await challengeSession.update({ challenge: options.challenge })

  return options
})
