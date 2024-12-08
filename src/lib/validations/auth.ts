export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres'
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula'
  }
  
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula'
  }
  
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número'
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)'
  }
  
  return null
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Email inválido'
  }
  return null
}

export function validateFullName(fullName: string): string | null {
  if (fullName.length < 3) {
    return 'O nome completo deve ter pelo menos 3 caracteres'
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(fullName)) {
    return 'O nome deve conter apenas letras'
  }
  
  if (!/\s/.test(fullName)) {
    return 'Por favor, insira seu nome completo'
  }
  
  return null
}
