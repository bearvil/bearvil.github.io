#!/usr/bin/env python3
"""Local preview server that mimics GitHub Pages routing for the Bearvil site.

The production host (GitHub Pages) resolves extensionless URLs to their `.html`
file (`/contact` -> `contact.html`) and serves the custom `404.html` for any
missing path. The stock `python3 -m http.server` does neither, so clicking the
nav links 404s locally. This dev-only helper replicates both behaviors so a
local preview matches production.

Run:  python3 serve.py            # http://localhost:8000
      python3 serve.py 8080       # custom port

This file is a development convenience only — it is not part of the deployed
static site and GitHub Pages never runs it.
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        local = super().translate_path(path)
        # Extensionless URL with no matching file/dir -> try the `.html` file.
        if not os.path.exists(local) and not os.path.splitext(local)[1]:
            html = local + ".html"
            if os.path.isfile(html):
                return html
        return local

    def end_headers(self):
        # Always serve the current file from disk — a dev preview should never
        # show a stale cached copy after an edit.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        # Serve the styled 404 page for missing paths, like GitHub Pages does.
        if code == 404:
            page = os.path.join(ROOT, "404.html")
            if os.path.isfile(page):
                with open(page, "rb") as f:
                    body = f.read()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    with http.server.ThreadingHTTPServer(("", port), PagesHandler) as httpd:
        print(f"Bearvil preview (GitHub Pages routing) -> http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")


if __name__ == "__main__":
    main()
