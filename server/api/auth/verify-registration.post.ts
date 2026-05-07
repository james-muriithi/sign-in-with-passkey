import {
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import fs from "fs";
import z from "zod";
import { useValidateBody } from '../../utils/validate';

const CHALLENGES_FILE = "/tmp/passkey-challenges.json";

const getChallenge = (email: string) => {
  if (!fs.existsSync(CHALLENGES_FILE)) {
    return null;
  }
  const challenges = JSON.parse(fs.readFileSync(CHALLENGES_FILE, "utf-8"));
  return challenges[email] || null;
};

const verificationSchema = z.object({
  email: z.string().email(),
  response: z.custom<RegistrationResponseJSON>(),
});

export default defineEventHandler(async (event) => {
  const { email, response } = await useValidateBody(event, verificationSchema);
  const challenge = getChallenge(email);
  let verification;
  if (!challenge) {
    throw createError({ statusCode: 404, message: "Challenge not found" });
  }
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: useWebAuthnConfig().origin,
      expectedRPID: useWebAuthnConfig().rpID,
    });
  } catch (_) {
    throw createError({ statusCode: 400, message: "Verification failed" });
  }
  const { verified, registrationInfo } = verification;
  return { verified, registrationInfo };
});
