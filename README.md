# General Agent

Minimalny handbook techniczny dla wykonawców (Cursor / Codex) w repozytorium `kwaczur/general-agent`.

## Notion ↔ GitHub

- **Notion** — źródło prawdy dla scope'u, decyzji operatora i stanu procesu: Zadania, Zlecenia builderskie, Dry-runs, Raporty wykonania, Analiza raportu.
- **GitHub** — źródło prawdy dla kodu, plików, branchy, commitów, Pull Requestów, testów i stanu technicznego.

Szczegóły: [AGENTS.md](./AGENTS.md).

## Handbook

| Plik | Opis |
|------|------|
| [AGENTS.md](./AGENTS.md) | Zasady technicznego wykonania |
| [docs/builder-workflow.md](./docs/builder-workflow.md) | Cykl: Zlecenie → Dry-run (`Realizuj`) → branch → testy → PR → Raport wykonania → Analiza raportu → merge / korekta |
| [docs/report-template.md](./docs/report-template.md) | Szablon Raportu wykonania i dowodów |

Raporty wykonania i Analizy raportu są osobnymi rekordami w dedykowanych bazach Notion.
Każda praca repozytoryjna wymaga **ID Zlecenia** w branchu (gdy możliwe), w tytule PR oraz w Raporcie wykonania w Notion.
