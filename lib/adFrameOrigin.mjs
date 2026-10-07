/** Only bare, separate HTTPS origins; HTTP is limited to two loopback test origins. */
export function validateAdFrameOrigin(raw, parentOrigin) {
  if (!raw || !parentOrigin) return null;
  try {
    const ad = new URL(raw);
    const parent = new URL(parentOrigin);
    const loopback = host => ["localhost", "127.0.0.1", "[::1]"].includes(host);
    if (ad.username || ad.password || ad.pathname !== "/" || ad.search || ad.hash) return null;
    if (ad.origin === parent.origin) return null;
    if (ad.protocol !== "https:" &&
        !(ad.protocol === "http:" && parent.protocol === "http:" && loopback(ad.hostname) && loopback(parent.hostname))) return null;
    return ad.origin;
  } catch { return null; }
}
