'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../github-auth-button';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth/loginAction';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
    /*.min(8, { message: 'Password must be at least 8 characters long' }) // Longitud mínima
    .max(100, { message: 'Password must not exceed 100 characters' })   // Longitud máxima
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }) // Al menos una letra mayúscula
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' }) // Al menos una letra minúscula
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })           // Al menos un número
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)' })*/ // Al menos un carácter especial
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter(); // Asegúrate de que esto esté en un componente de cliente
  /*const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');*/
  const defaultRedirectUrl = '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const defaultValues = {
    email: 'demo@gmail.com'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
       const {success, message} = await loginAction(data.email, data.password)
      
       if(!success){
        setError(message)
        return
       }
       router.push('/dashboard');
    } catch (err) {
      setError('Unexpected error occurred');
      router.push(defaultRedirectUrl); // Mensaje de error en caso de excepción
    } finally {
      setLoading(false); // Restablece el estado de carga
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
     {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />*/}
    </>
  );
}
