# Szablon Raportu wykonania Zlecenia builderskiego

Nowy rekord w bazie Raporty wykonania. Raport jest dowodem wykonania, nie Analizą, autoryzacją merge ani promocją Wersji.

## Metadane

| Pole | Wartość |
|---|---|
| Identyfikator runu | |
| Identyfikator Zlecenia | |
| Decyzja źródłowa | |
| Dry-run | |
| Wybrana Opcja | |
| Efekt akceptacji | `Merge do main` / `Zachowaj jako kandydata` |
| Wersja docelowa | |
| Handbook — SHA na `main` | |
| Data / czas raportu | |

## Zakres

- Treść Decyzji — streszczenie mandatu:
- Elementy objęte Decyzją:
- Elementy objęte realizacją:
- Granice i jawne wykluczenia:

## Stan wejściowy

| Pole | Wartość |
|---|---|
| Repozytorium | |
| Branch | |
| Bazowy SHA `origin/main` | |
| HEAD startowy | |
| Working tree | |

## Porównanie manifestu z wykonaniem

Każda pozycja Dry-runu musi mieć osobny wiersz. Nie pomijaj operacji niewykonanych.

| # | Artefakt / fragment | Planowano | Wykonano | Odstępstwo / uzasadnienie | Dowód |
|---|---|---|---|---|---|
| 1 | | | | | |

## Co zostało dodane / usunięte / zmienione

- ✅ Dodane:
- ❌ Usunięte:
- ♻️ Zmienione:

## Pliki zmienione

- Utworzone:
- Zmodyfikowane:
- Usunięte:
- Potwierdzenie braku plików poza manifestem:

## Dowody dla Elementów

Raport wskazuje dowody, ale nie oznacza Elementu jako gotowego do domknięcia.

| Element objęty realizacją | Oczekiwany rezultat | Dowód | Stan dowodu |
|---|---|---|---|
| | | | pełny / częściowy / brak |

## Testy i tożsamość kandydata

| Pole / test | Wynik | Uwagi |
|---|---|---|
| SHA kandydata | | |
| SHA przetestowany | | |
| Zgodność SHA | OK / FAIL | |
| Obecność wymaganych plików | PASS / FAIL | |
| Spójność odnośników i treści | PASS / FAIL | |
| Zakres diffu | PASS / FAIL | |
| Testy automatyczne repo | PASS / FAIL / brak w repo | |
| Nowy commit po testach | nie / tak | `tak` unieważnia PASS |

## Linki GitHub

| Artefakt | URL / SHA |
|---|---|
| Repozytorium | |
| Branch | |
| Commit(y) | |
| Pull Request | URL + relacja w Notion |

## Stan merge

- PR state:
- `merged_at` / `Merged At`:
- Merge potwierdzony: tak / nie
- `closed` ani boolean `merged` nie są samodzielnym dowodem.
- Dla `Zachowaj jako kandydata` merge musi pozostać niepotwierdzony.

## Niewykonane elementy i residual

- Niewykonane:
- Residual:
- Ryzyka:
- Blokery:

## Pakiet przekazania kandydata

Wypełnij tylko dla `Zachowaj jako kandydata`.

- Wersja docelowa:
- Dokładny SHA:
- Manifest zmian Custom Agenta:
- Manifest triggerów:
- Manifest permissions:
- Instrukcja adaptacji / migracji:
- Punkt odniesienia rollbacku:
- Wymagania właściwego rollbacku runtime’u:
- Ograniczenia i otwarte pytania:

Pakiet nie autoryzuje adaptacji, publikacji ani promocji.

## Decyzje wymagające operatora

-

## Potwierdzenia

- [ ] Pełna bramka Decyzji i Zlecenia była spełniona przed wykonaniem.
- [ ] Wykonano wyłącznie Dry-run `Realizuj` i wybraną Opcję.
- [ ] Każda pozycja manifestu ma wynik i dowód.
- [ ] Wszystkie odstępstwa zostały ujawnione.
- [ ] SHA kandydata jest zgodny z SHA przetestowanym.
- [ ] Relacja Pull Request została ustawiona.
- [ ] Fakt merge odczytano wyłącznie z `merged_at` / `Merged At`.
- [ ] Przy `Zachowaj jako kandydata` PR nie został zmergowany.
- [ ] Raport nie domknął automatycznie Elementów ani Zadania.
- [ ] Brak deploymentu, publikacji i mutacji Custom Agenta poza osobną autoryzacją.
- [ ] ID Zlecenia występuje w PR i Raporcie oraz w branchu, jeśli możliwe.
