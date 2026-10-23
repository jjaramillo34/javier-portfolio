// Fallback for requests outside any locale (rare: the proxy routes almost everything to one).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "6rem 1rem" }}
      >
        <h1>Page not found</h1>
        <p>
          <a href="/">Back home</a>
        </p>
      </body>
    </html>
  );
}
