import db from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event);
  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
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
  }
});
