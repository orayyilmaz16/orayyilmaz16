#!/usr/bin/env bash
# PostToolUse hook: README.md her değiştiğinde commit + pull --rebase + push yapar.
input="$(cat)"
case "$input" in
  *README.md*) ;;
  *) exit 0 ;;
esac

cd "$(git rev-parse --show-toplevel)" || exit 0
git add README.md
if git diff --cached --quiet; then
  exit 0
fi
git commit -m "docs: README.md güncellendi" -m "Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>" >/dev/null 2>&1 || exit 0
git pull --rebase --autostash origin main >/dev/null 2>&1
if git push origin main >/dev/null 2>&1; then
  echo "README.md commit + push tamamlandı." >&2
else
  echo "UYARI: push başarısız oldu; elle kontrol edin." >&2
fi
exit 0
