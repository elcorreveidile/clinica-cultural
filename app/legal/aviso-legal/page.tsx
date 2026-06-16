import LegalPage from '@/components/LegalPage';

export const metadata = { title: 'Aviso legal · Clínica Cultural' };

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal e información RGPD">
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de que este sitio web es titularidad
        de [RESPONSABLE / ENTIDAD], con NIF [NIF] y domicilio en [DIRECCIÓN, Granada]. Contacto:{' '}
        <a href="mailto:[EMAIL]">[EMAIL]</a>.
      </p>

      <h2>2. Condiciones de uso</h2>
      <p>
        El acceso a este sitio atribuye la condición de usuario e implica la aceptación de las
        condiciones recogidas en este aviso legal, la política de privacidad y la política de
        cookies.
      </p>

      <h2>3. Protección de datos (RGPD)</h2>
      <p>
        El tratamiento de los datos personales se realiza conforme al Reglamento (UE) 2016/679 (RGPD)
        y la LOPDGDD. Consulta los detalles en nuestra{' '}
        <a href="/legal/privacidad">Política de privacidad</a>.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio (textos, imágenes, marcas, logotipos y código) están
        protegidos por los derechos de propiedad intelectual e industrial.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        La Clínica no se hace responsable del mal uso de los contenidos ni de los daños derivados de
        un uso indebido de la plataforma.
      </p>
    </LegalPage>
  );
}
