export function obfuscateEmail(email: string): string {
  return [...email].map((c) => `&#${c.codePointAt(0)};`).join('');
}
