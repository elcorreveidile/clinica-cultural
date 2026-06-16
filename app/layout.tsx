import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clínica Cultural y Lingüística de Español',
  description:
    'No es un curso. Es una experiencia integral que combina el aprendizaje del español con inmersión cultural en Granada.',
  icons: {
    icon: '/imgs/logos/logo.png',
    apple: '/imgs/logos/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { borderRadius: '10px', background: '#2C3E50', color: '#fff' },
          }}
        />
      </body>
    </html>
  );
}
