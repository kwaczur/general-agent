# AGENTS.md — handbook techniczny General Agent

Minimalny, wersjonowany zestaw instrukcji technicznych dla wykonawców (Cursor, Codex i równoważne).
Obowiązuje w repozytorium `kwaczur/general-agent`.

## Źródła prawdy

| Domena | System | Odpowiedzialność |
|--------|--------|------------------|
| Scope i decyzje | Notion | Cel Zadania, scope Zlecenia builderskiego, Dry-runs (statusy), Raporty wykonania, Analiza raportu, decyzje operatora |
| Kod i stan techniczny | GitHub | Pliki, branche, commity, Pull Requesty, testy, faktyczny stan po merge |
| Normy operacyjne | Notion + ten handbook (commit na `main`) | Tożsamość, zasady, kontrakt, pętla zleceń |
| Execution | Cursor / Codex | Odczyt, implementacja wyłącznie wg dry-runu `Realizuj`, weryfikacja, Raport wykonania |

GitHub **nie** autoryzuje dodatkowych operacji ani nie zastępuje decyzji operatora z Notion.
Notion **nie** zastępuje live weryfikacji stanu technicznego w GitHubie.
Status ani treść w Notion **nie są** dowodem merge — dowodem jest stan zsynchronizowanego Pull Requesta (rollup `Zmergowano` na Raporcie wykonania).

## Zanim zaczniesz pracę techniczną

1. Potwierdź bieżące **Zlecenie builderskie**: ma dokładnie **jedno** powiązane Zadanie. `Etap` Zlecenia to formuła — tylko do odczytu.
2. Odczytaj powiązane **Zadanie**, **Projekt** oraz wskazane repozytoria/artefakty.
3. Potwierdź autoryzację wykonania: **najnowszy Dry-run** Zlecenia (baza Dry-runs) ma status **`Realizuj`**. Starsze dry-runy mają status `Zastąpiony` i niczego nie autoryzują.
4. Odczytaj ten handbook (`AGENTS.md`) oraz `docs/builder-workflow.md`; zanotuj commit SHA handbooka na `main` (trafia do Raportu wykonania).
5. Zweryfikuj stan Git: remote, branch, HEAD, `origin/main`, working tree.
6. Brak danych, drift, konflikt albo niejednoznaczność → **stop**, raportuj blokadę. Nie improwizuj.

## Zasady wykonania

- Wykonuj **wyłącznie** operacje z manifestu dry-runu `Realizuj`.
- Nie rozszerzaj scope'u. Ogólna zgoda na cel ≠ zgoda na niewymienione operacje.
- Nie zatwierdzaj własnego dry-runu, PR-a, Raportu wykonania ani Analizy raportu.
- Nie zmieniaj schematu Notion, aktywnych norm, konfiguracji Custom Agenta ani dokumentacji normatywnej.
- **Merge do `main`** jest dozwolony wyłącznie po decyzji operatora **`Zaakceptuj`** na Analizie raportu. Dowodem merge jest niepuste `Zmergowano` na Raporcie (rollup ze zsynchronizowanego PR-a) — nigdy status ani treść raportu.
- Deployment to zawsze osobna, jawna decyzja operatora.
- Historia jest niemutowalna: dry-runy, Raporty wykonania i Analizy raportu nie są nadpisywane; korekta = nowy rekord albo nowe Zlecenie.
- Nie zapisuj sekretów ani danych klientów w Notion ani w repozytorium.
- Fail-closed: przy niedostępności Notion, Zlecenia, autoryzacji albo technical truth — tylko odczyt i raport blokady.

## Identyfikator Zlecenia

Każda praca repozytoryjna **musi** zawierać ID Zlecenia builderskiego:

1. **Branch** — ID w nazwie brancha (np. `cursor/zlecenie-<ID>-…`), o ile środowisko wykonawcze na to pozwala.
2. **Pull Request** — ID w tytule (np. `Zlecenie #<ID> …`).
3. **Raport wykonania** — osobny rekord w bazie **Raporty wykonania** z ID Zlecenia oraz relacjami: Zlecenie builderskie, Dry-run, Pull Request (zsynchronizowana baza GitHub).

Jeżeli harness wymusza inną nazwę brancha, odnotuj ograniczenie w Raporcie i **obowiązkowo** umieść ID w tytule PR oraz w Raporcie.

## Artefakty handbooku

- [AGENTS.md](./AGENTS.md) — ten plik (zasady techniczne)
- [docs/builder-workflow.md](./docs/builder-workflow.md) — cykl builderski
- [docs/report-template.md](./docs/report-template.md) — szablon Raportu wykonania / dowodów
