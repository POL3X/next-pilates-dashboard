'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sessionAction } from './actions/auth/sessionAction';

export async function middleware(request: NextRequest) {
  try {
    // Llamada a la acción que obtiene la sesión del usuario
    const session = await sessionAction();
    
    // Si se obtiene una sesión válida, redirige al dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    // Si ocurre un error (por ejemplo, no hay sesión o falla la verificación)
    // Se permite la navegación a la pantalla de login.
    console.error('Error verificando sesión:', error);
  }
  // Si no hay sesión válida, se continúa en la página de login.
  return NextResponse.next();
}
// Configuración del middleware para que solo se aplique a la ruta de login
export const config = { matcher: ['/'] };
