# 🖥️ PyTrack Desktop (Tauri 2 + React)

App desktop oficial da PyTrack para **Windows · macOS · Linux**. Consome o **mesmo backend** da web (Supabase + Stripe), com RLS, 2FA e gating por plano. **Só login** (cadastro é no site).

> Construído a partir de `prompts/app-desktop.md`.

## 🧱 Stack

- **Tauri 2** (Rust) — binários nativos pequenos e seguros, cross-platform.
- **React 18 + Vite + TypeScript + Tailwind** (tokens da marca) + **react-router**.
- **@supabase/supabase-js** (auth/dados), **@tanstack/react-query** (cache).
- **Pyodide** (WebAssembly via CDN) para a **IDE Python** rodando localmente.
- **@tauri-apps/plugin-shell** para abrir links externos (Stripe/registro) no navegador.

## 📂 Estrutura

```
src/                       # frontend React
  lib/        supabase, billing (tiers), trilhas (17)
  hooks/      useAuth (sessão, perfil, tier, MFA, unread)
  components/ Sidebar, ui (Card/Button/Input/Badge)
  screens/    Login, Mfa, Inicio, Trilhas, TrilhaDetalhe, Exercicios,
              Comunidade, Notificacoes, Perfil, Plano, Ia, Conteudos, Ide, Placeholder
src-tauri/                 # shell Rust (Tauri 2)
  Cargo.toml, tauri.conf.json (CSP p/ Pyodide+Supabase+Stripe), src/, capabilities/
.github/workflows/build.yml  # build cross-OS (matriz win/mac/linux) → GitHub Release
```

## 🔐 Segurança

- **CSP** na webview liberando só Pyodide (`cdn.jsdelivr.net` + `wasm-unsafe-eval`), Supabase (`*.supabase.co` + `wss`), Stripe e o site.
- Só a **anon key pública** no bundle — autorização por **RLS**. Sem `service_role`.
- **2FA (TOTP)** bloqueia o app até `aal2`. Pagamentos abrem o navegador (sem cartão no app).
- `shell:allow-open` restrito; sem segredos de servidor.

## ▶️ Desenvolvimento

```bash
cd aplicativos/desktop
npm install
cp .env.example .env     # preencha VITE_SUPABASE_ANON_KEY
npm run tauri:dev        # app desktop com hot-reload
```

## 📦 Build (instaladores)

```bash
npm run tauri:build
```

Gera em `src-tauri/target/release/bundle/`:
- **macOS**: `.dmg` + `.app` (use `--target universal-apple-darwin` para Intel+ARM).
- **Windows**: `.msi` + `.exe` (NSIS).
- **Linux**: `.AppImage` + `.deb`.

> Cada OS gera seus próprios instaladores. Para os 3 de uma vez, use o **GitHub Actions** (`.github/workflows/build.yml`): dê push numa tag `desktop-v1.0.0` e a matriz (windows/macos/ubuntu) compila e anexa os artefatos numa Release. Configure os secrets `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no repo.

## 🚀 Distribuição na plataforma

Os instaladores vão para a rota **`/aplicativo`** (tabela `app_releases`, `platform` = `windows`/`macos`/`linux`). Como o Supabase free limita 50MB/arquivo, hospede-os em **GitHub Releases** e registre a `download_url` em `app_releases` (mesmo fluxo do APK Android).

## ✅ Implementado

- Login e-mail/senha + GitHub OAuth + 2FA; sem cadastro.
- Sidebar com grupos (Estudar/Carreira/Conta/Admin), badge de notificações.
- Início (XP/nível/atalhos/upgrade), Trilhas (17 + detalhe), Exercícios (busca real nos +5.000),
  Comunidade (feed Markdown, gating Completo+), Notificações, Perfil, Plano, IA (BYOK), Conteúdos.
- **IDE Python (Pyodide)** rodando localmente com Ctrl/Cmd+Enter.
- Rotas premium (currículo/extensão/entrevista) abrem a experiência completa na web.

## 🔜 Próximos

Command palette (Ctrl+K), multi-painel (lição + IDE), notificações nativas, updater assinado, i18n, tutorial/cookies na 1ª abertura.
