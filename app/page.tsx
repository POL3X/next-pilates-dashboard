import UserAuthForm from '@/components/forms/user-auth-form';
import PageContainer from '@/components/layout/page-container';

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      {/* Contenedor centrado que ocupa el alto completo de la ventana */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Contenedor interno con un ancho máximo */}
        <div className="w-full max-w-md p-4">
          <UserAuthForm />
        </div>
      </div>
    </PageContainer>
  );
}
