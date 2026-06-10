import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Spinner } from "@/components/ui";
import { Login } from "@/screens/Login";
import { Mfa } from "@/screens/Mfa";
import { Inicio } from "@/screens/Inicio";
import { Trilhas } from "@/screens/Trilhas";
import { TrilhaDetalhe } from "@/screens/TrilhaDetalhe";
import { Exercicios } from "@/screens/Exercicios";
import { Comunidade } from "@/screens/Comunidade";
import { Notificacoes } from "@/screens/Notificacoes";
import { Perfil } from "@/screens/Perfil";
import { Plano } from "@/screens/Plano";
import { IaSettings } from "@/screens/Ia";
import { Ide } from "@/screens/Ide";
import { Conteudos } from "@/screens/Conteudos";
import { Placeholder } from "@/screens/Placeholder";

function Shell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/trilhas/:id" element={<TrilhaDetalhe />} />
          <Route path="/conteudos" element={<Conteudos />} />
          <Route path="/exercicios" element={<Exercicios />} />
          <Route path="/ide" element={<Ide />} />
          <Route path="/comunidade" element={<Comunidade />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/ia" element={<IaSettings />} />
          <Route path="/curriculo" element={<Placeholder title="Gerador de currículo" web="/curriculo" min="completo" />} />
          <Route path="/extensao" element={<Placeholder title="Extensão VS Code" web="/extensao" min="suprema" />} />
          <Route path="/entrevista-ia" element={<Placeholder title="Entrevista com IA" web="/entrevista-ia" min="suprema" />} />
          <Route path="/vagas" element={<Placeholder title="Vagas" web="/vagas" min="completo" />} />
          <Route path="/evolucao" element={<Placeholder title="Evolução" web="/evolucao" min="free" />} />
          <Route path="/stack" element={<Placeholder title="Stack do ecossistema" web="/stack" min="free" />} />
          <Route path="/configuracoes" element={<Placeholder title="Configurações" web="/configuracoes" min="free" />} />
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  const { loading, session, needsMfa } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }
  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  if (needsMfa) {
    return (
      <Routes>
        <Route path="*" element={<Mfa />} />
      </Routes>
    );
  }
  return <Shell />;
}
