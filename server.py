#! /usr/bin/env python3
# -*- coding: utf-8 -*-
import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 8080

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
	'.html': 'text/html',
	'.css':	'text/css',
	'.js':	'application/x-javascript',
    '.wasm': 'application/wasm',
	'': 'application/octet-stream', # Default
}

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()