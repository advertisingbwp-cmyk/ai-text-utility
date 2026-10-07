// Two controlled origins, no advertising/network providers. Run manually for real browser SOP tests.
import http from "node:http";
import { readFile } from "node:fs/promises";
const parent = await readFile(new URL("./ad-isolation-parent.html", import.meta.url));
const child = await readFile(new URL("./ad-isolation-child.html", import.meta.url));
for (const [port, page] of [[3004, parent], [3005, child]]) {
  http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html", "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-src http://127.0.0.1:3005; connect-src 'none'; img-src 'none'" });
    res.end(page);
  }).listen(port, "127.0.0.1", () => console.log("Controlled security fixture: http://127.0.0.1:"+port));
}
