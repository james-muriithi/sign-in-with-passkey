import type { H3Event } from "h3";
import type { ZodType } from "zod";

export const useValidateBody = async <T>(event: H3Event, schema: ZodType<T>): Promise<T> => {
  const body = await readBody(event);
  const result = schema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Validation failed",
      data: result.error.issues,
    });
  }

  return result.data;
};
