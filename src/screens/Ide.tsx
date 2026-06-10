import { useEffect, useRef, useState } from "react";
import { Play, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

// Pyodide carregado via CDN (CSP permite cdn.jsdelivr.net + wasm-unsafe-eval)
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

const DEFAULT_CODE = `# IDE Python — roda no seu computador (Pyodide/WebAssembly)
def saudacao(nome: str) -> str:
    return f"Olá, {nome}! Bem-vindo à PyTrack 🐍"

print(saudacao("dev"))

# experimente:
for i in range(1, 6):
    print(i, i ** 2)
`;

export function Ide() {
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    (async () => {
      if (!window.loadPyodide) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
        s.onload = init;
        document.body.appendChild(s);
      } else {
        init();
      }
    })();
    async function init() {
      try {
        const py = await window.loadPyodide!({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" });
        py.setStdout({ batched: (s) => setOutput((o) => o + s + "\n") });
        py.setStderr({ batched: (s) => setOutput((o) => o + s + "\n") });
        pyodideRef.current = py;
        setReady(true);
      } catch {
        setOutput("Falha ao carregar o Python. Verifique a conexão.");
      }
    }
  }, []);

  async function run() {
    if (!pyodideRef.current) return;
    setRunning(true);
    setOutput("");
    try {
      await pyodideRef.current.runPythonAsync(code);
    } catch (e) {
      setOutput((o) => o + "\n" + String(e));
    } finally {
      setRunning(false);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  }

  return (
    <div className="flex h-screen flex-col p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">IDE Python</h1>
          <p className="text-xs text-text-dim">{ready ? "Python pronto — Ctrl/Cmd+Enter para rodar" : "Carregando Python (Pyodide)..."}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOutput("")}><Trash2 className="h-4 w-4" /> Limpar</Button>
          <Button onClick={run} disabled={!ready || running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Rodar
          </Button>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          className="h-full resize-none rounded-xl border border-border bg-[#0d0d10] p-4 font-mono text-sm text-zinc-100 outline-none focus:border-primary"
        />
        <pre className="h-full overflow-auto rounded-xl border border-border bg-black p-4 font-mono text-sm text-green">
          {output || (ready ? "// a saída aparece aqui" : "// carregando Python...")}
        </pre>
      </div>
    </div>
  );
}
