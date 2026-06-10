import type { Tier } from "./billing";

export interface Trilha {
  id: string;
  title: string;
  subtitle: string;
  tier: Tier;
  level: string;
  accent: string;
  topicsCount: number;
}

// as 17 trilhas (espelha lib/trilhas.ts do site)
export const TRILHAS: Trilha[] = [
  { id: "primeiros-passos", title: "Primeiros Passos", subtitle: "Do zero ao primeiro programa", tier: "free", level: "Básico", accent: "#29E0A9", topicsCount: 30 },
  { id: "python-developer", title: "Python Developer", subtitle: "Programador Python completo", tier: "essencial", level: "Intermediário", accent: "#5F75F2", topicsCount: 24 },
  { id: "backend-developer", title: "Backend Developer", subtitle: "APIs, bancos e autenticação", tier: "essencial", level: "Intermediário", accent: "#5F75F2", topicsCount: 26 },
  { id: "data-analytics", title: "Data Analytics", subtitle: "Análise de dados com Python", tier: "essencial", level: "Intermediário", accent: "#5F75F2", topicsCount: 22 },
  { id: "automacao", title: "Automação & Produtividade", subtitle: "Scripts, scraping e bots", tier: "essencial", level: "Intermediário", accent: "#5F75F2", topicsCount: 20 },
  { id: "desktop-jogos", title: "Apps Desktop & Jogos", subtitle: "GUIs e game dev", tier: "essencial", level: "Intermediário", accent: "#5F75F2", topicsCount: 18 },
  { id: "engenharia-dados", title: "Engenharia de Dados", subtitle: "Pipelines, Spark e Big Data", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 28 },
  { id: "machine-learning", title: "Machine Learning & IA", subtitle: "ML, deep learning e LLMs", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 30 },
  { id: "devops-cloud", title: "DevOps & Cloud", subtitle: "Docker, K8s, CI/CD, AWS", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 26 },
  { id: "arquitetura", title: "Arquitetura de Software", subtitle: "DDD, clean architecture", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 22 },
  { id: "iot-embarcados", title: "IoT & Embarcados", subtitle: "MicroPython e sensores", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 20 },
  { id: "cyber-security", title: "Cyber Security", subtitle: "Segurança ofensiva e defensiva", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 24 },
  { id: "blockchain", title: "Blockchain", subtitle: "Web3 e smart contracts", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 18 },
  { id: "bioinformatica", title: "Bioinformática", subtitle: "Python na biologia computacional", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 18 },
  { id: "quant-financas", title: "Quant & Finanças", subtitle: "Trading algorítmico e análise", tier: "completo", level: "Avançado", accent: "#9956F6", topicsCount: 20 },
  { id: "python-mastery", title: "Python Mastery — Suprema", subtitle: "Todos os módulos + SaaS final", tier: "suprema", level: "Especialista", accent: "#E254FF", topicsCount: 120 },
];
