import { Inter, STIX_Two_Text } from 'next/font/google';

const fontInter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const fontStixTwo = STIX_Two_Text({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-stix',
  weight: ['400', '500', '600', '700'],
});

export { fontInter, fontStixTwo };
