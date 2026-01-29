export function isoToEmoji(iso: string) {
  return iso
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65),
    );
}
