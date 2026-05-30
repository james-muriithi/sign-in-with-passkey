

export default defineEventHandler(async (event) => {
    await clearAuthSession(event);
    return { success: true };
})