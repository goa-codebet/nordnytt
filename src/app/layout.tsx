import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nördnytt! 🤓',
  description: 'Senaste från HackerNews',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='sv'>
      <body className='bg-slate-100'>
        <div className='p-4 mx-auto max-w-xl'>
          <a href='/' className='block text-4xl mb-10 font-extrabold'>
            <Image
              src='/logo.webp'
              className='h-16 w-16 mr-5 inline-block'
              alt='Nördnytt logga'
              width={100}
              height={100}
            />
            Nördnytt! 🤓
          </a>

          {children}

          <div className='bg-slate-200 text-slate-600 p-2 text-sm'>
            <p>
              Alla inlägg kommer från{' '}
              <a target='_blank' href='https://news.ycombinator.com'>
                HackerNews
              </a>
              .
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
