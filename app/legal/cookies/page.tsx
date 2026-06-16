import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Política de cookies · Clínica Cultural' };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <p>
        Esta web utiliza el mínimo de cookies necesario para funcionar. A continuación te explicamos
        cuáles y para qué.
      </p>

      <h2>1. ¿Qué es una cookie?</h2>
      <p>
        Una cookie es un pequeño archivo que se almacena en tu dispositivo al visitar una web y que
        permite recordar información sobre tu visita.
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <ul>
        <li>
          <strong>Técnicas / estrictamente necesarias:</strong> mantienen tu sesión iniciada
          (cookie <code>cc_session</code>). Son imprescindibles y están exentas de consentimiento.
        </li>
        <li>
          <strong>Analíticas y de terceros:</strong> actualmente <em>no</em> utilizamos cookies de
          analítica ni de publicidad. Si se incorporaran, se solicitaría tu consentimiento previo.
        </li>
      </ul>

      <h2>3. Gestión de cookies</h2>
      <p>
        Puedes configurar o eliminar las cookies desde los ajustes de tu navegador. Ten en cuenta que
        desactivar las cookies técnicas puede impedir el correcto funcionamiento del acceso.
      </p>
    </LegalPage>
  );
}
