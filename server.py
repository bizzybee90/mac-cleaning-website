"""Dev server with clean URL support (matches Cloudflare Pages behaviour)."""
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Strip query strings for file lookup
        path = self.path.split('?')[0]

        # If path doesn't have extension and isn't a directory, try .html
        if '.' not in os.path.basename(path) and not path.endswith('/'):
            html_path = path + '.html'
            full_path = os.path.join(os.getcwd(), html_path.lstrip('/'))
            if os.path.isfile(full_path):
                self.path = html_path

        return super().do_GET()

if __name__ == '__main__':
    PORT = 8080
    with http.server.HTTPServer(('', PORT), CleanURLHandler) as httpd:
        print(f'Serving on http://localhost:{PORT}')
        httpd.serve_forever()
