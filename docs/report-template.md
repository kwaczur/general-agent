# Szablon Raportu wykonania Zlecenia builderskiego

Wypełnij jako **nowy rekord w bazie Raporty wykonania** w Notion po zakończeniu (lub przerwaniu) wykonania.
Relacje rekordu: **Zlecenie builderskie**, **Dry-run** (wykonana wersja), **Pull Request** (zsynchronizowana baza GitHub).

## Metadane

| Pole | Wartość |
|------|---------|
| Identyfikator runu | |
| Identyfikator Zlecenia | |
| Dry-run (wykonany rekord) | |
| Handbook (commit SHA na `main`) | |
| Data / czas raportu | |
| Wykonawca | Cursor / Codex / … |

## Źródła wykorzystane

- Zlecenie:
- Zadanie:
- Projekt:
- Repozytoria / artefakty:

## Stan wejściowy (przy starcie wykonania)

- Repo:
- Branch:
- Bazowy SHA (`origin/main`):
- HEAD startowy:
- Working tree:

## Co weszło / co wyszło

Trzon raportu: callouty od góry do dołu po strukturze kodu, na podstawie rzeczywistego diffu PR-a — własnymi słowami, nie kopią Description PR-a.

- ✅ Weszło:
- ❌ Nie weszło / wyszło:

## Wykonane operacje

1.
2.

## Różnice względem planu (dry-run)

- Brak / opis odstępstw:

## Pliki zmienione

- Utworzone:
- Zmodyfikowane:
- Usunięte:

## Testy

| Test | Wynik | Uwagi |
|------|-------|-------|
| Obecność wymaganych plików | | |
| Spójność odnośników / kryteria treściowe | | |
| `git status --short` / zakres diff | | |
| Testy automatyczne repo | PASS / FAIL / **brak w repo** | |

## Weryfikacja kryteriów akceptacji

- [ ] Kryterium 1:
- [ ] Kryterium 2:

## Linki GitHub

| Artefakt | URL / SHA |
|----------|-----------|
| Branch | |
| Commit(y) | |
| Pull Request | (URL + relacja w Notion) |

Uwaga: pola `Zmergowano` **nie wypełnia się** — to rollup ze zsynchronizowanego PR-a. Przy tworzeniu Raportu powinno być puste (merge jeszcze nie istnieje).

## Niewykonane elementy

-

## Residual / pozostałości

-

## Stan rollbacku

- Odwracalność: tak / częściowo / nie
- Punkt bez powrotu osiągnięty: nie / tak (opis)

## Wykryte ryzyka

-

## Blokery

-

## Decyzje wymagające operatora

-

## Potwierdzenia

- [ ] Brak zmian poza zakresem dry-runu `Realizuj`
- [ ] Brak merge do `main` na etapie raportu
- [ ] Brak deploymentu
- [ ] Brak mutacji konfiguracji Notion / Custom Agenta / norm (jeśli poza zakresem)
- [ ] ID Zlecenia obecne w PR i Raporcie (oraz w branchu, jeśli możliwe)
- [ ] Relacja Pull Request ustawiona; `Zmergowano` puste
