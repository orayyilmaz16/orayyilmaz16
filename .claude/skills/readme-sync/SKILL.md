---
name: readme-sync
description: GitHub profil README'sindeki proje tablolarını (öne çıkan / diğer) yeniden üretir, commit eder ve push eder. Proje listesi, yıldız, README tabloları veya repo açıklamaları istendiğinde kullan.
---

# README sync

1. `node scripts/update-readme.mjs` çalıştır. Betik GitHub'dan public repoları çeker ve `<!-- PROJECTS:START -->` / `<!-- PROJECTS:END -->` arasını yeniden yazar.
2. Repo açıklaması eksikse `scripts/project-meta.json` dosyasına **yalnızca kullanıcının verdiği** metni ekle. Açıklama uydurma.
3. `git diff README.md` ile değişikliği kontrol et.
4. Commit ve push: `git add README.md`, mesaja `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` satırını ekle, `git pull --rebase origin main`, sonra `git push origin main`.
5. Çakışma olursa dur, kullanıcıya bildir. Çakışma işaretli dosyayı commit etme.

Kurallar için bkz. `CLAUDE.md`.
