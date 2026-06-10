import { useEffect, useState } from "react";
import { Download, X, Loader2 } from "lucide-react";

interface UpdateInfo {
  version: string;
  body?: string;
  downloadAndInstall: (cb?: (e: { event: string; data?: { contentLength?: number; chunkLength?: number } }) => void) => Promise<void>;
}

// Verifica atualizações via Tauri Updater (assinadas). Só roda no app desktop.
export function UpdateChecker() {
  const [update, setUpdate] = useState<UpdateInfo | null>(null);
  const [installing, setInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // só existe dentro do Tauri
        if (!("__TAURI_INTERNALS__" in window)) return;
        const { check } = await import("@tauri-apps/plugin-updater");
        const result = await check();
        if (result) setUpdate(result as unknown as UpdateInfo);
      } catch {
        /* sem updater (dev/web) — ignora */
      }
    })();
  }, []);

  async function install() {
    if (!update) return;
    setInstalling(true);
    try {
      await update.downloadAndInstall();
      const { relaunch } = await import("@tauri-apps/plugin-process");
      await relaunch();
    } catch {
      setInstalling(false);
    }
  }

  if (!update || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-2xl border border-primary/40 bg-surface p-4 shadow-2xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Nova versão disponível</p>
            <p className="text-xs text-text-dim">PyTrack {update.version}</p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-text-dim hover:text-white"><X className="h-4 w-4" /></button>
      </div>
      {update.body ? <p className="mt-2 max-h-20 overflow-auto text-xs text-text-dim">{update.body}</p> : null}
      <button
        onClick={install}
        disabled={installing}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {installing ? <><Loader2 className="h-4 w-4 animate-spin" /> Instalando...</> : <>Atualizar e reiniciar</>}
      </button>
    </div>
  );
}
