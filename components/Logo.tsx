import Link from 'next/link';

/** Logo oficial de la Clínica (libro + Alhambra + fonendo + wordmark).
 *  El propio archivo ya incluye el texto, así que se muestra como imagen única. */
export default function Logo({
  href = '/',
  className = '',
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <img
        src="/imgs/logos/logo_clinica.png?v=2"
        alt="Clínica Cultural y Lingüística"
        className="h-12 md:h-14 w-auto object-contain"
      />
    </Link>
  );
}
