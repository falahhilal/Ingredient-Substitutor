import '../styles/global.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'AltBites',
  description: 'App description here',
  icons: {
    icon: '/bg2.png', 
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-blur" />
        {children}
      </body>
    </html>
  );
}