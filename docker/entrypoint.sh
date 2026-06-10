#!/bin/sh
# Inicia X virtual + window manager + VNC + noVNC e o app PyTrack.
set -e
echo "Iniciando PyTrack Desktop (noVNC em http://localhost:6080)..."

Xvfb :0 -screen 0 1280x800x24 -ac +extension GLX +render -noreset >/dev/null 2>&1 &
sleep 2
fluxbox >/dev/null 2>&1 &
x11vnc -display :0 -nopw -forever -shared -rfbport 5900 -quiet >/dev/null 2>&1 &
websockify --web=/usr/share/novnc 6080 localhost:5900 >/dev/null 2>&1 &
sleep 2

# o binário instalado pelo .deb (Tauri usa o productName em minúsculo)
APP="$(command -v pytrack || echo /usr/bin/pytrack)"
echo "Abrindo $APP"
# webkit em headless precisa de --no-sandbox em alguns ambientes
exec "$APP" --no-sandbox
