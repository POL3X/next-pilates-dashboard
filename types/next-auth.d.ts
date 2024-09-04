
import NextAuth, { DefaultSession} from 'next-auth';
import { JWT } from "next-auth/jwt"

declare module 'next-auth' {
  interface User{
    id: string; // Cambiado de string | undefined a string
    access_token: string;
    expires_on: number;
    emailVerified: Date | null; // Actualizado a Date | null para que coincida con el tipo de AdapterUser
  }
  

  interface Session extends DefaultSession{
    user: User
    error: string;
}
  
  interface CredentialsInputs {
    email: string;
    password: string;
  }

}

// Extender el tipo JWT
declare module 'next-auth/jwt' {

  interface JWT {
    user: User
  }

}