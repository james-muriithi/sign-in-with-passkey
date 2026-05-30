export const useWebAuthnConfig = () => {
  const { webauthn } = useRuntimeConfig();

  return {
    rpName: webauthn.rpName,
    rpID: webauthn.rpId,
    origin: webauthn.origin,
  };
};
