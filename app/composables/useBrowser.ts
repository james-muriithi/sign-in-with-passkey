export const useBrowser = () => {
  const isPasskeySupported = computed(() => {
    if (!import.meta.client) {
      return false;
    }
    return window.PublicKeyCredential !== undefined;
  });

  return {
    isPasskeySupported,
  };
};
