// Local-only server. Production uses Vercel's static output, never this server.
import http from "node:http";
import { readFile } from "node:fs/promises";
const port = Number(process.env.AD_HOST_PORT || 3003);
const routes = new Map(["banner-320x50","banner-300x250","banner-728x90","native"].map(name => ["/"+name, name+".html"]));
routes.set("/status.js", "status.js");
http.createServer(async (req, res) => {
  const name = routes.get(new URL(req.url, "http://localhost").pathname);
  if (!name) { res.writeHead(404); res.end("Not found"); return; }
  try {
    const body = await readFile(new URL("./public/"+name, import.meta.url));
    res.writeHead(200, { "Content-Type": name.endsWith(".js") ? "text/javascript" : "text/html", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "frame-ancestors http://127.0.0.1:3002 http://localhost:3002" });
    res.end(body);
  } catch { res.writeHead(500); res.end("Unavailable"); }
}).listen(port, "127.0.0.1", () => console.log("Ad test host listening on http://127.0.0.1:"+port));
