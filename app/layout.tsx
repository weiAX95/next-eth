import '@/app/ui/global.css';
import { inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}  text-xl text-gray-800 md:text-3xl md:leading-normal`}>{children}</body>
    </html>
  );
}


export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
