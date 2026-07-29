# Cykl builderski General Agent

Opis technicznego przebiegu pojedynczej zmiany. Scope i decyzje pochodzą z Notion; implementacja, testy i wersjonowanie — z GitHuba.

## Przepływ

```text
Zadanie (Notion)
  → Zlecenie builderskie (dokładnie jedno Zadanie)
    → Dry-run (rekord w bazie Dry-runs, Status: Do oceny)
        [+ Opcje 1-z-N → operator zaznacza Wybierz na dokładnie jednej]
      → decyzja operatora:
          Aktualizuj → nowy Dry-run (Do oceny); poprzedni = Zastąpiony
          Realizuj  → manifest zamrożony (+ wybrana Opcja), start wykonania
            → Branch + implementacja + testy
              → Commit + Push + Pull Request (bez merge)
                → Raport wykonania (osobny rekord, relacja do PR)
                  → Analiza raportu (Do oceny; Wpływ na zadanie, Merge)
                    → decyzja operatora:
                        Zaakceptuj      → merge PR → Zmergowano
                        Stwórz zlecenie → Zlecenie korygujące
                    (osobisty merge operatora w GitHubie = Zaakceptuj)
```

## Opcje (warianty dry-runu)

- Dry-run może mieć powiązane rekordy **Opcje** — alternatywne warianty realizacji tego samego zakresu (**1-z-N**).
- Decyzję podejmuje operator, zaznaczając checkbox **`Wybierz`** na **dokładnie jednej** Opcji. Zaznaczona Opcja to wersja, na którą operator się decyduje — staje się wiążącą częścią manifestu dry-runu.
- Wykonawca realizuje dry-run **w wariancie wybranej Opcji**; pozostałe Opcje niczego nie autoryzują i nie są realizowane.
- Fail-closed: jeżeli dry-run `Realizuj` ma Opcje, a `Wybierz` nie jest zaznaczone na żadnej albo jest zaznaczone na więcej niż jednej → **stop**, raportuj blokadę.
- Opcje są częścią niemutowalnej historii: nie nadpisuje się ich treści po decyzji; zmiana wariantu = `Aktualizuj` → nowy dry-run z nowymi Opcjami.

## Kroki wykonawcy

### 1. Walidacja wejścia

- Odczytaj Zlecenie, Zadanie, Projekt, wskazane materiały.
- Potwierdź, że Zlecenie ma dokładnie **jedno** powiązane Zadanie.
- Potwierdź, że **najnowszy Dry-run** Zlecenia ma status **`Realizuj`** — to jedyna autoryzacja wykonania. Dry-runy `Zastąpiony` niczego nie autoryzują.
- Jeżeli dry-run ma Opcje: potwierdź, że dokładnie jedna ma zaznaczone `Wybierz`, i realizuj wariant tej Opcji.
- Sprawdź brak driftu: cel, zakres, kryteria, pliki, uprawnienia, ryzyka, testy, rollback.
- Sprawdź Git: czyste drzewo (lub stan zgodny z planem), zgodność SHA bazowego.

### 2. Branch

- Pracuj na branchu wykonawczym wskazanym w dry-runie / harnessie.
- Umieść **ID Zlecenia** w nazwie brancha, gdy to możliwe.
- Base: zwykle `main`; SHA bazowy potwierdź przed pierwszą mutacją.

### 3. Implementacja

- Wykonaj wyłącznie operacje z manifestu dry-runu `Realizuj` (w wariancie wybranej Opcji).
- Nie dodawaj plików, refaktorów ani „ulepszeń" poza zakresem.
- Po zmianie planu → stop, raportuj blokadę; dalsza praca wymaga nowego Dry-runu i decyzji operatora `Realizuj`.

### 4. Testy

- Uruchom wyłącznie testy zatwierdzone w dry-runie.
- Jeśli repozytorium nie definiuje testów dla danej zmiany — odnotuj brak w Raporcie; nie symuluj wyniku.

### 5. Commit, push, PR

- Commit message zawiera odniesienie do ID Zlecenia.
- Push na branch wykonawczy.
- Otwórz Pull Request do `main`; **tytuł zawiera `Zlecenie #<ID>`**.
- **Bez merge** na tym etapie — merge następuje dopiero po decyzji `Zaakceptuj` na Analizie raportu (albo po osobistym merge operatora w GitHubie).

### 6. Raport wykonania

- Utwórz **nowy rekord w bazie Raporty wykonania** (szablon: [report-template.md](./report-template.md)).
- Ustaw relacje: Zlecenie builderskie, wykonany Dry-run, **Pull Request** (zsynchronizowana baza GitHub).
- Treść opisz własnymi słowami na podstawie rzeczywistego PR-a (opis, commity, diff, checki) — **nigdy nie kopiuj Description PR-a 1:1**.
- Trzon treści: callouty **„co zostało dodane / co zostało usunięte"** od góry do dołu po strukturze kodu.
- Pola `Zmergowano` nie wypełniasz — to rollup z PR-a; przy tworzeniu Raportu merge nie istnieje.
- Dołącz dowody: branch, SHA commitów, URL PR, wynik testów / brak testów, residual, blokady.

### 7. Merge (po decyzji operatora)

- Wykonuj wyłącznie po decyzji operatora **`Zaakceptuj`** na Analizie raportu.
- **Osobisty merge operatora bezpośrednio w GitHubie jest równoważny decyzji `Zaakceptuj`** — stan w Notion uzgadnia się wtedy post-factum (Analiza raportu → `Zaakceptuj`, adnotacja o trybie decyzji).
- Przed merge ponownie sprawdź stan PR-a: konflikt, checki, zmiany po raporcie → stop i raport blokady.
- Wykonaj merge PR-a; potwierdzeniem jest niepuste `Zmergowano` na Raporcie wykonania.
- Merge częściowy nie zamyka Zadania. Deployment to osobna decyzja operatora.

## Zakazy

- Rozszerzanie scope poza manifest dry-runu `Realizuj` i wybraną Opcję
- Autoryzacja wyłącznie na podstawie GitHuba lub rozmowy
- Merge do `main` bez decyzji operatora (`Zaakceptuj` na Analizie albo osobisty merge operatora w GitHubie); deployment bez osobnej jawnej zgody
- Traktowanie Raportu lub statusu w Notion jako dowodu merge (dowód = `Zmergowano`)
- Nadpisywanie historii: dry-runów, Opcji, Raportów wykonania, Analiz raportu (korekta = nowy rekord / nowe Zlecenie)
- Zmiana schematu Notion, norm, Custom Agenta poza zakresem
- Sekrety i dane klientów w Notion lub repozytorium

## Powiązane pliki

- [AGENTS.md](../AGENTS.md) — zasady techniczne
- [report-template.md](./report-template.md) — szablon Raportu wykonania
