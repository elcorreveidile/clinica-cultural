// Tipos compartidos en cliente y servidor.
// Reexporta los enums de Prisma para no duplicar definiciones.
export type UserRole = 'patient' | 'tutor_local' | 'professor' | 'admin';
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const LANGUAGE_LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Forma del usuario que viaja al cliente (sin campos sensibles).
export interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  currentLevel: LanguageLevel | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
