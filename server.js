// Simple Bun server for local development
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    // Default to index.html
    if (filePath === '/') {
      filePath = '/index.html';
    }

    // Serve files from current directory
    const file = Bun.file(`.${filePath}`);

    // Check if file exists
    if (await file.exists()) {
      return new Response(file);
    }

    // 404 for missing files
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🚀 Ikigai Auto Parts website running at http://localhost:${server.port}`);
