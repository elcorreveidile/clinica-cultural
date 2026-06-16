import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Política de privacidad · Clínica Cultural' };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        En la <strong>Clínica Cultural y Lingüística de Español</strong> nos tomamos en serio la
        protección de tus datos personales, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley
        Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Responsable: [RESPONSABLE / ENTIDAD]. NIF: [NIF]. Dirección: [DIRECCIÓN, Granada]. Correo de
        contacto: <a href="mailto:[EMAIL]">[EMAIL]</a>.
      </p>

      <h2>2. Datos que tratamos</h2>
      <ul>
        <li>Datos identificativos y de contacto (nombre, correo electrónico).</li>
        <li>Datos académicos del diagnóstico lingüístico (nivel, resultados de los tests).</li>
        <li>Datos de uso de la plataforma necesarios para prestar el servicio.</li>
      </ul>

      <h2>3. Finalidades</h2>
      <ul>
        <li>Gestionar tu cuenta y el acceso mediante enlace mágico.</li>
        <li>Realizar tu diagnóstico y ofrecerte recursos y tutoría personalizados.</li>
        <li>Comunicarnos contigo en relación con el servicio.</li>
      </ul>

      <h2>4. Legitimación</h2>
      <p>
        La base legal es la ejecución del servicio solicitado, tu consentimiento y, en su caso, el
        interés legítimo de la Clínica.
      </p>

      <h2>5. Conservación</h2>
      <p>
        Conservamos tus datos mientras mantengas tu cuenta activa y, después, durante los plazos
        legalmente exigibles.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a <a href="mailto:[EMAIL]">[EMAIL]</a>. También puedes reclamar
        ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </LegalPage>
  );
}
