export function toPascalCase(text: string): string {
  return text
    .split(/[^a-zA-Z0-9]/) // Divide por qualquer caractere que não seja letra ou número
    .filter(Boolean) // Remove strings vazias
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Converte para PascalCase
    .join(''); // Junta tudo em uma única string
}
