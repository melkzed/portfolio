import http from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const preferredPort = Number.parseInt(process.env.PORT || "5173", 10);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mkv": "video/x-matroska",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function getFilePath(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (request, response) => {
  const filePath = getFilePath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const stats = await fileExists(filePath) ? await stat(filePath) : null;
  const resolvedPath = stats?.isDirectory() ? path.join(filePath, "index.html") : filePath;

  if (!(await fileExists(resolvedPath))) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream"
  });
  createReadStream(resolvedPath).pipe(response);
});

function listen(port) {
  server.listen(port, "127.0.0.1");
}

server.on("listening", () => {
  const address = server.address();
  console.log(`Portfolio rodando em http://127.0.0.1:${address.port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    listen(server.address()?.port ? server.address().port + 1 : preferredPort + 1);
    return;
  }

  throw error;
});

listen(preferredPort);
