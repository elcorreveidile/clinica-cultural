import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

// Autoriza la subida de archivos del portafolio directamente desde el
// navegador a Vercel Blob (evita el límite de 4,5 MB de las funciones
// serverless, así que admite audio y vídeo).
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'El almacenamiento de archivos no está configurado en este entorno (falta BLOB_READ_WRITE_TOKEN).' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await getSessionUser();
        if (!user) throw new Error('No autenticado');
        return {
          allowedContentTypes: ['image/*', 'application/pdf', 'audio/*', 'video/*'],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      // El registro en la base de datos lo crea el cliente tras la subida.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
