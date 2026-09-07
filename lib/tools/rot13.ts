/**
 * ROT13 Cipher
 * Replaces each Latin letter with the 13th letter after it in the alphabet.
 * Preserves case, spaces, symbols, and non-ASCII Unicode characters.
 */

export function rot13(text: string): string {
  if (!text) return "";

  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    // Uppercase: 65 ('A') to 90 ('Z')
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }
    // Lowercase: 97 ('a') to 122 ('z')
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    }
    return char;
  });
}
