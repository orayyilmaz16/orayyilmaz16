// README proje tablolarını GitHub verisinden üretir.
// - Öne Çıkan: yıldızı olan public, fork olmayan repolar (yıldıza göre sıralı)
// - Diğer Projeler: yıldızı olmayan repolardan kod boyutuna göre ilk 5 (büyükten küçüğe)
// Çıktı README.md içindeki <!-- PROJECTS:START --> ... <!-- PROJECTS:END --> arasına yazılır.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const USER = "orayyilmaz16";
const OTHERS_LIMIT = 5;
const README = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "README.md");
const START = "<!-- PROJECTS:START -->";
const END = "<!-- PROJECTS:END -->";

const headers = { Accept: "application/vnd.github+json", "User-Agent": "readme-sync" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&page=${page}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos.filter((r) => !r.fork && !r.private && r.name !== USER);
}

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();

const META = JSON.parse(await readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "project-meta.json"), "utf8"));

function techCell(r) {
  const tags = META[r.name]?.tags ?? [];
  const parts = [];
  if (r.language) parts.push(`\`${r.language}\``);
  for (const t of [...tags, ...(r.topics ?? [])].slice(0, 5)) parts.push(`\`${t}\``);
  return parts.join(" ") || "—";
}

function descCell(r) {
  const d = esc(META[r.name]?.description || r.description);
  return d || "_Açıklama eklenmedi_";
}

function row(r) {
  const star = `![stars](https://img.shields.io/github/stars/${USER}/${r.name}?style=flat-square&label=%E2%AD%90&color=yellow)`;
  const kb = r.size ? `${r.size} KB` : "—";
  return `| [**${esc(r.name)}**](${r.html_url}) ${star} | ${descCell(r)} | ${techCell(r)} | ${kb} |`;
}

function table(rows) {
  const head = "| Proje | Açıklama | Teknoloji | Boyut |\n|:--|:--|:--|--:|";
  return rows.length ? `${head}\n${rows.map(row).join("\n")}` : "_Henüz gösterilecek proje yok._";
}

const repos = await fetchRepos();
const starred = repos
  .filter((r) => r.stargazers_count > 0)
  .sort((a, b) => b.stargazers_count - a.stargazers_count || b.size - a.size);
const others = repos
  .filter((r) => r.stargazers_count === 0)
  .sort((a, b) => b.size - a.size)
  .slice(0, OTHERS_LIMIT);

const block = [
  START,
  `<div align="center">`,
  ``,
  `#### ⭐ Öne Çıkan Projeler`,
  `<sub>Yıldız alan public repolar · yıldıza göre sıralı</sub>`,
  ``,
  table(starred),
  ``,
  `#### 🧪 Diğer Projeler`,
  `<sub>Kod boyutuna göre ilk ${OTHERS_LIMIT} proje</sub>`,
  ``,
  table(others),
  ``,
  `👉 *Tüm projeler: [GitHub Repositories](https://github.com/${USER}?tab=repositories)*`,
  ``,
  `</div>`,
  END,
].join("\n");

const current = await readFile(README, "utf8");
const pattern = new RegExp(`${START}[\\s\\S]*?${END}`);
if (!pattern.test(current)) throw new Error(`README.md içinde ${START} / ${END} işaretçileri bulunamadı.`);
const next = current.replace(pattern, block);

if (next === current) {
  console.log("README projeleri zaten güncel.");
} else {
  await writeFile(README, next, "utf8");
  console.log(`README güncellendi: ${starred.length} öne çıkan, ${others.length} diğer proje.`);
}
