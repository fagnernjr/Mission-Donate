import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Mission Donate</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <LoginForm />
          <div className="text-center pb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
