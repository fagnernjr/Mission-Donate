import { UpdatePassword } from '@/components/auth/UpdatePassword'

export default function UpdatePasswordPage() {
  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Atualizar Senha</h1>
        <p className="text-muted-foreground">
          Digite sua nova senha
        </p>
      </div>
      <UpdatePassword />
    </div>
  )
}
