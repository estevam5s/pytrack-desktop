# PyTrack Desktop em Docker — roda o app no navegador via noVNC.
#   docker run --rm -p 6080:6080 ghcr.io/estevam5s/pytrack-desktop:latest
#   abra http://localhost:6080
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive \
    DISPLAY=:0 \
    WEBKIT_DISABLE_COMPOSITING_MODE=1 \
    WEBKIT_DISABLE_DMABUF_RENDERER=1

# dependências do Tauri (webkit2gtk) + servidor X virtual + noVNC
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl \
        xvfb x11vnc fluxbox novnc websockify \
        libwebkit2gtk-4.1-0 libgtk-3-0 libayatana-appindicator3-1 librsvg2-2 \
        libnss3 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# instala a versão da release (passada no build)
ARG VERSION=1.0.1
RUN curl -fSL "https://github.com/estevam5s/pytrack-desktop/releases/download/desktop-v${VERSION}/PyTrack_${VERSION}_amd64.deb" -o /tmp/pytrack.deb \
    && apt-get update \
    && apt-get install -y --no-install-recommends /tmp/pytrack.deb \
    && rm -f /tmp/pytrack.deb \
    && rm -rf /var/lib/apt/lists/*

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 6080
ENTRYPOINT ["/entrypoint.sh"]
