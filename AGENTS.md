# AGENTS.md — handbook techniczny General Agent

Minimalny, wersjonowany zestaw instrukcji technicznych dla wykonawców (Cursor, Codex i równoważne).
Obowiązuje w repozytorium `kwaczur/general-agent`.

## Źródła prawdy

| Domena | System | Odpowiedzialność |
|--------|--------|------------------|
| Scope i approval | Notion | Cel Zadania, scope Zlecenia builderskiego, dry run, akceptacja operatora, raport, decyzje |
| Kod i stan techniczny | GitHub | Pliki, branche, commity, Pull Requesty, testy, faktyczny stan po merge |
| Normy operacyjne | Notion (PIO-21 / aktywny rules bundle) | Tożsamość, zasady, kontrakt, pętla zleceń |
| Execution | Cursor / Codex | Odczyt, implementacja wyłącznie wg zaakceptowanego dry runu, weryfikacja, raport |

GitHub **nie** autoryzuje dodatkowych operacji ani nie zastępuje approval z Notion.
Notion **nie** zastępuje live weryfikacji stanu technicznego w GitHubie.

## Zanim zaczniesz pracę techniczną

1. Potwierdź bieżące **Zlecenie builderskie** i jego Status.
2. Odczytaj powiązane **Zadanie**, **Projekt** oraz wskazane repozytoria/artefakty.
3. Ustal zaakceptowaną wersję **Dry Run** (akceptacja = Status `Zlecenie w realizacji`).
4. Odczytaj ten handbook (`AGENTS.md`) oraz `docs/builder-workflow.md`.
5. Zweryfikuj stan Git: remote, branch, HEAD, `origin/main`, working tree.
6. Brak danych, drift, konflikt albo niejednoznaczność → **stop**, oznacz `Wymaga interwencji`, raportuj. Nie improwizuj.

## Zasady wykonania

- Wykonuj **wyłącznie** operacje z zaakceptowanego manifestu dry runu.
- Nie rozszerzaj scope’u. Ogólna zgoda na cel ≠ zgoda na niewymienione operacje.
- Nie zatwierdzaj własnego dry runu, PR-a ani raportu.
- Nie zmieniaj schematu Notion, aktywnych norm, konfiguracji Custom Agenta ani dokumentacji normatywnej.
- Nie wykonuj merge do `main` ani deploymentu bez osobnej, jawnej zgody.
- Nie zapisuj sekretów ani danych klientów w Notion ani w repozytorium.
- Fail-closed: przy niedostępności Notion, Zlecenia, approval albo technical truth — tylko odczyt i raport blokady.

## Identyfikator Zlecenia

Każda praca repozytoryjna **musi** zawierać ID Zlecenia builderskiego:

1. **Branch** — ID w nazwie brancha (np. `cursor/zlecenie-<ID>-…`), o ile środowisko wykonawcze na to pozwala.
2. **Pull Request** — ID w tytule (np. `Zlecenie #<ID> …`).
3. **Raport** — ID w raporcie Zlecenia w Notion, wraz z linkami do brancha, commitów i PR.

Jeżeli harness wymusza inną nazwę brancha, odnotuj ograniczenie w raporcie i **obowiązkowo** umieść ID w tytule PR oraz w raporcie.

## Artefakty handbooku

- [AGENTS.md](./AGENTS.md) — ten plik (zasady techniczne)
- [docs/builder-workflow.md](./docs/builder-workflow.md) — cykl builderski
- [docs/report-template.md](./docs/report-template.md) — szablon raportu / dowodów
