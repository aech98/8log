import { ConfigOptions } from 'cloudinary';

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

export const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
