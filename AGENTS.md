# AGENTS.md — handbook techniczny General Agent

Minimalny, wersjonowany kontrakt techniczny wykonawcy (**Cursor**) w repozytorium `kwaczur/general-agent`.

## Źródła prawdy

| Domena | Źródło prawdy |
|---|---|
| Mandat, kierunek i granice | Treść Przyjętej Decyzji w Notion |
| Lifecycle, routing i kontrole procesu | Properties oraz relacje Decyzji, Zlecenia, Dry-runu, Raportu, Analizy i Wersji w Notion |
| Outcome Zadania | Elementy ukończenia; są punktami rezultatu, nie zamiennikiem treści Decyzji |
| Stan techniczny | GitHub: pliki, branche, commity, PR-y, checki i `merged_at` / `Merged At` |
| Runtime | Opublikowana konfiguracja Custom Agenta, permissions i triggery |
| Wykonanie | Cursor, wyłącznie w autoryzowanym zakresie |
| Promocja i operacje krytyczne | Operator |

GitHub nie autoryzuje dodatkowych operacji. Notion nie zastępuje live kontroli GitHuba. Raport ani ręczny status w Notion nie są dowodem merge.

## Model zakresu

```text
Treść Przyjętej Decyzji → szczegółowy mandat
Decyzja → Elementy objęte decyzją
Zlecenie → podzbiór: Elementy objęte realizacją
Analiza → podzbiór: Elementy gotowe do domknięcia
```

Elementy kotwiczą outcome i domknięcie Zadania. Nie definiują samodzielnie pełnego planu. Dry-run przekłada mandat Decyzji na dokładny manifest technicznych mutacji i nie może go rozszerzać.

## Twarda bramka przed wykonaniem

Potwierdź łącznie:

1. Zlecenie ma dokładnie jedną źródłową Decyzję.
2. `Lifecycle docelowy = Przyjęta`.
3. `Dalsze postępowanie = Kandydat Zlecenia builderskiego`.
4. `Kontrola zakresu Decyzji = OK`.
5. `Kontrola zakresu Zlecenia = OK`.
6. Najnowszy Dry-run ma stan `Realizuj`; starsze są `Zastąpiony`.
7. Jeśli Dry-run ma Opcje, dokładnie jedna ma `Wybierz`.
8. Odczytano treść Decyzji, Elementy objęte realizacją i manifest Dry-runu.
9. Odczytano ten handbook i zanotowano jego SHA na `main`.
10. Zweryfikowano remote, branch, HEAD, bazowy `origin/main` i working tree.

Brak danych, wynik kontroli inny niż `OK`, konflikt albo drift → **stop** i Raport blokady. Rozmowa, treść PR-a ani sam status Dry-runu nie zastępują mandatu.

## Zmiana planu

- Korekta techniczna lub wyjaśnienie bez zmiany mandatu → nowy Dry-run w tej samej Decyzji; poprzedni `Zastąpiony`.
- Istotna zmiana celu, kierunku, granic lub Elementów Decyzji → stop; nowa Decyzja z `Geneza decyzji`, a następnie nowe Zlecenie lub Dry-run.
- Nie wolno rozszerzać Przyjętej Decyzji przez edycję Dry-runu.

## Zasady wykonania

- Wykonuj wyłącznie manifest Dry-runu `Realizuj` i wybraną Opcję.
- Nie dodawaj plików, refaktorów ani ulepszeń poza zakresem.
- Nie zatwierdzaj własnej Decyzji, Opcji, Dry-runu, Raportu, Analizy ani promocji.
- Nie zmieniaj schema Notion, norm, Custom Agenta, triggerów ani permissions, jeśli nie są jawnie objęte osobną pracą adaptacyjną.
- Testuj dokładny commit SHA. Nowy commit unieważnia wcześniejszy wynik testu.
- Historia jest niemutowalna: korekta = nowy rekord albo nowa iteracja.
- Nie zapisuj sekretów ani danych klientów w Notion lub repozytorium.
- Przy niedostępności źródła prawdy wykonuj wyłącznie odczyt i raportuj blokadę.

## Raport i Analiza

Raport jest lustrzanym dowodem Dry-runu. Dla każdej pozycji manifestu zapisuje: `planowano → wykonano / odstąpiono → dowód` oraz niewykonane elementy, residual i ryzyka.

Raport wskazuje dowody dla Elementów objętych realizacją, ale nie deklaruje ich gotowości do domknięcia. Robi to Analiza, wyłącznie dla podzbioru zakresu Zlecenia. Merge ani Raport nie zamykają automatycznie Elementu lub Zadania.

## Efekt akceptacji

Każde przyszłe Zlecenie ma jawny `Efekt akceptacji`.

### `Merge do main`

Zaakceptowana Analiza pozwala przejść do ponownej kontroli PR. Przed merge sprawdź head SHA, bazowy SHA, przesunięcie `main`, konflikty, checki i zmiany po Raporcie. Drift lub nowy commit → stop, aktualizacja dowodów i ponowne testy.

### `Zachowaj jako kandydata`

- zaakceptowana Analiza nie autoryzuje merge;
- PR pozostaje niezmergowany;
- wymagane są dokładny SHA, Raport, Wersja docelowa i pakiet przekazania;
- Builders kończy odpowiedzialność na stanie `Kandydat przyjęty`;
- adaptacja, promocja, publikacja i rollback runtime’u należą do osobnego Zadania.

Osobisty merge operatora nie zastępuje jawnego Efektu akceptacji. Przy kandydacie merge jest błędem niezależnie od statusu Analizy.

## Techniczny fakt merge

- `closed` nie oznacza merge;
- boolean `merged` nie jest samodzielnym dowodem;
- dowodem jest niepuste `merged_at` w GitHub / `Merged At` w synchronizacji;
- PR jest relacją Raportu, a fakt merge nie jest wpisywany ręcznie.

## Pakiet przekazania kandydata

Dla `Zachowaj jako kandydata` Raport zawiera:

- branch, dokładny SHA i URL PR;
- SHA przetestowany i wyniki testów;
- manifest wymaganych zmian Custom Agenta, triggerów i permissions;
- instrukcję adaptacji lub migracji;
- ograniczenia, residual i blokery;
- punkt odniesienia oraz wymagania przyszłego rollbacku.

Pakiet jest wejściem do adaptacji, nie zgodą na jej wykonanie.

## Identyfikator Zlecenia

Praca wykonywana w docelowym workflow zawiera ID Zlecenia w branchu, tytule PR i Raporcie, gdy środowisko na to pozwala. Jeśli harness wymusza inną nazwę brancha, ograniczenie trafia do Raportu, a ID nadal występuje w PR i Raporcie.

## Artefakty handbooku

- [AGENTS.md](./AGENTS.md) — zasady techniczne
- [docs/builder-workflow.md](./docs/builder-workflow.md) — przebieg pętli
- [docs/report-template.md](./docs/report-template.md) — Raport i dowody
