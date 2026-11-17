# Proje kuralları (Claude için)

Bu repo, GitHub profil README'si (`README.md`) için kullanılıyor.

## Proje tabloları
- Öne çıkan ve diğer proje tabloları elle düzenlenmez. `README.md` içindeki `<!-- PROJECTS:START -->` ile `<!-- PROJECTS:END -->` arası `scripts/update-readme.mjs` tarafından üretilir.
- Kurallar: **Öne Çıkan** = yıldızı olan public, fork olmayan repolar (yıldıza göre). **Diğer Projeler** = yıldızsız repolardan kod boyutuna (`size`) göre ilk 5.
- Repo açıklaması ve etiketleri için `scripts/project-meta.json` kullanılır. Yeni repo için açıklama eklemek istenirse bu dosyaya bir kayıt eklenir; açıklama uydurulmaz.
- Tabloyu değiştirmek için betiği değiştirin, sonra `node scripts/update-readme.mjs` çalıştırın.

## Otomasyon
- `.github/workflows/readme-sync.yml`: her 6 saatte bir, `scripts/**` push'larında ve elle tetiklemede çalışır; değişiklik varsa README'yi commit + push eder.
- `.claude/settings.json` → `PostToolUse` hook'u: `README.md` düzenlendiğinde `.claude/auto-sync.sh` commit + `pull --rebase` + push yapar. Commit mesajlarına `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` satırı eklenir.

## Git
- Push öncesi `git pull --rebase` yapılır. Çakışma olursa önce çözülür; conflict işaretli dosya commit edilmez.
- Force push yapılmaz.

## Gizlilik
- Private repoların adı, açıklaması veya içeriği README'ye yazılmaz. Betik yalnızca public repoları listeler.
- Kişisel e-posta veya gerçek kullanıcı ID'si, API anahtarı ya da token dokümana yazılmaz.
