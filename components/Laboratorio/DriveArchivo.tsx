// Incrusta una carpeta PÚBLICA de Google Drive (vista de cuadrícula).
// La carpeta debe estar compartida como "cualquiera con el enlace".

export default function DriveArchivo({ folderId }: { folderId: string }) {
  if (!folderId) {
    return (
      <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-6 text-sm text-clinic-blue/70">
        El archivo del laboratorio aún no está conectado. Comparte la carpeta de Drive como
        «cualquiera con el enlace» y añádela para ver aquí guiones, tomas, fotos y fichas de
        personajes.
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-clinic-gray">
      <iframe
        title="Archivo del laboratorio (Google Drive)"
        src={`https://drive.google.com/embeddedfolderview?id=${folderId}#grid`}
        className="w-full"
        style={{ height: '70vh', border: 'none' }}
      />
    </div>
  );
}
