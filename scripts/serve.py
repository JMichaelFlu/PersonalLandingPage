"""Local preview server that mirrors .htaccess: /now serves now.html, misses get 404.html."""
import http.server
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 4173


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path, _, query = self.path.partition('?')
        local = self.translate_path(path)
        if not os.path.exists(local) and os.path.isfile(local + '.html'):
            self.path = path + '.html' + ('?' + query if query else '')
        return super().send_head()

    def send_error(self, code, message=None, explain=None):
        page = os.path.join(ROOT, '404.html')
        if code != 404 or not os.path.isfile(page):
            return super().send_error(code, message, explain)
        with open(page, 'rb') as f:
            body = f.read()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)


if __name__ == '__main__':
    print(f'Serving {ROOT} at http://localhost:{PORT}')
    http.server.ThreadingHTTPServer(('localhost', PORT), Handler).serve_forever()
