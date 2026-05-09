import type { User } from "~/generated/prisma/client";
import db from "../../utils/db";

export type UserProfile = Pick<User, "id" | "email" | "name"> & {
  hasPasskeys: boolean;
};

export const getUserProfile = async (email: string): Promise<UserProfile | null> => {
  const user = await db.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      email: true,
      name: true,
      passkeys: { select: { id: true, transports: true } },
    },
  });

  const { passkeys, ...userData } = user ?? {};

  return {
    ...userData,
    hasPasskeys: (passkeys?.length ?? 0) > 0,
  } as UserProfile;
};

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event);
  if (!session) {
    return null;
  }

  return await getUserProfile(session.email);
});
