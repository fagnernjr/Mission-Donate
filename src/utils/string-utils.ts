export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-')  // Substitui espaços e underscores por hífen
    .replace(/^-+|-+$/g, '')   // Remove hífens no início e fim
    + '-' + Math.random().toString(36).substring(2, 7)  // Adiciona um sufixo único
}
