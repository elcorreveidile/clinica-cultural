import Link from 'next/link';

/** Marca de la Clínica: símbolo latido→burbuja "C" + wordmark. */
export default function Logo({
  href = '/',
  className = '',
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <img
        src="/imgs/logos/logo.png"
        alt="Clínica Cultural y Lingüística"
        className="h-9 w-9 object-contain"
        width={36}
        height={36}
      />
      <span className="text-xl font-bold text-clinic-red font-heading">
        Clínica Cultural
      </span>
    </Link>
  );
}
