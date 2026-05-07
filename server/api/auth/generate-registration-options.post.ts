import { generateRegistrationOptions } from "@simplewebauthn/server";
import fs from "fs";

const CHALLENGES_FILE = "/tmp/passkey-challenges.json";

const saveChallenge = (challenge: string, email: string) => {
  // save to a json file for now, but you should save this to a database associated with the user
  let challenges: Record<string, string> = {};
  if (fs.existsSync(CHALLENGES_FILE)) {
    challenges = JSON.parse(fs.readFileSync(CHALLENGES_FILE, "utf-8"));
  }
  challenges[email] = challenge;
  fs.writeFileSync(CHALLENGES_FILE, JSON.stringify(challenges), "utf-8");
};

export default defineEventHandler(async (event) => {
  const { rpName, rpID } = useWebAuthnConfig();

  const user = {
    id: "123456",
    email: "johndoe@gmail.com",
    name: "John Doe",
  };
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    userDisplayName: user.name,
  });

  saveChallenge(options.challenge, user.email);

  return options;
});
