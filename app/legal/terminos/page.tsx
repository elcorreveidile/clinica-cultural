import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Términos y condiciones · Clínica Cultural' };

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones">
      <p>
        El uso de la plataforma <strong>Clínica Cultural y Lingüística de Español</strong> implica la
        aceptación de los presentes términos y condiciones.
      </p>

      <h2>1. Objeto</h2>
      <p>
        La Clínica ofrece un servicio de diagnóstico y acompañamiento en el aprendizaje del español
        con inmersión cultural en Granada (diagnóstico, recursos, tutoría y actividades).
      </p>

      <h2>2. Acceso y cuenta</h2>
      <p>
        El acceso se realiza mediante enlace mágico enviado a tu correo. Eres responsable de la
        confidencialidad de tu cuenta y del uso que se haga de ella.
      </p>

      <h2>3. Uso aceptable</h2>
      <ul>
        <li>No utilizar la plataforma con fines ilícitos o que perjudiquen a terceros.</li>
        <li>No intentar acceder a áreas o datos no autorizados.</li>
        <li>Respetar los derechos de propiedad intelectual de los contenidos.</li>
      </ul>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Los contenidos, marcas y materiales de la Clínica están protegidos. No se permite su
        reproducción sin autorización.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El servicio se presta «tal cual». La Clínica no garantiza resultados concretos de aprendizaje
        y no se responsabiliza de interrupciones ajenas a su control.
      </p>

      <h2>6. Modificaciones</h2>
      <p>
        Podremos actualizar estos términos. Te informaremos de los cambios sustanciales a través de
        la plataforma.
      </p>

      <h2>7. Legislación aplicable</h2>
      <p>Estos términos se rigen por la legislación española.</p>
    </LegalPage>
  );
}
