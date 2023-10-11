export function getGoogleCredentials() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!Boolean(googleClientId) || !Boolean(googleClientSecret)) {
    throw new Error('Google credentials is undefined');
  }

  return {
    googleClientId: googleClientId!,
    googleClientSecret: googleClientSecret!,
  };
}

export const nextAuthSecret = process.env.NEXT_AUTH_SECRET!;
