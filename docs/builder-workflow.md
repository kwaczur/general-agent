# Cykl builderski General Agent

Opis technicznego przebiegu pojedynczej zmiany. Scope i decyzje pochodzą z Notion; implementacja, testy i wersjonowanie — z GitHuba.

## Przepływ

```text
Zadanie (Notion)
  → Zlecenie builderskie (dokładnie jedno Zadanie)
    → Dry-run (rekord w bazie Dry-runs, Status: Do oceny) [+ Opcje 1-z-N]
      → decyzja operatora:
          Aktualizuj → nowy Dry-run (Do oceny); poprzedni = Zastąpiony
          Realizuj  → manifest zamrożony, start wykonania
            → Branch + implementacja + testy
              → Commit + Push + Pull Request (bez merge)
                → Raport wykonania (osobny rekord, relacja do PR)
                  → Analiza raportu (Do oceny; Wpływ na zadanie, Merge)
                    → decyzja operatora:
                        Zaakceptuj      → merge PR → Zmergowano
                        Stwórz zlecenie → Zlecenie korygujące
```

## Kroki wykonawcy

### 1. Walidacja wejścia

- Odczytaj Zlecenie, Zadanie, Projekt, wskazane materiały.
- Potwierdź, że Zlecenie ma dokładnie **jedno** powiązane Zadanie.
- Potwierdź, że **najnowszy Dry-run** Zlecenia ma status **`Realizuj`** — to jedyna autoryzacja wykonania. Dry-runy `Zastąpiony` niczego nie autoryzują.
- Sprawdź brak driftu: cel, zakres, kryteria, pliki, uprawnienia, ryzyka, testy, rollback.
- Sprawdź Git: czyste drzewo (lub stan zgodny z planem), zgodność SHA bazowego.

### 2. Branch

- Pracuj na branchu wykonawczym wskazanym w dry-runie / harnessie.
- Umieść **ID Zlecenia** w nazwie brancha, gdy to możliwe.
- Base: zwykle `main`; SHA bazowy potwierdź przed pierwszą mutacją.

### 3. Implementacja

- Wykonaj wyłącznie operacje z manifestu dry-runu `Realizuj`.
- Nie dodawaj plików, refaktorów ani „ulepszeń" poza zakresem.
- Po zmianie planu → stop, raportuj blokadę; dalsza praca wymaga nowego Dry-runu i decyzji operatora `Realizuj`.

### 4. Testy

- Uruchom wyłącznie testy zatwierdzone w dry-runie.
- Jeśli repozytorium nie definiuje testów dla danej zmiany — odnotuj brak w Raporcie; nie symuluj wyniku.

### 5. Commit, push, PR

- Commit message zawiera odniesienie do ID Zlecenia.
- Push na branch wykonawczy.
- Otwórz Pull Request do `main`; **tytuł zawiera `Zlecenie #<ID>`**.
- **Bez merge** na tym etapie — merge następuje dopiero po decyzji `Zaakceptuj` na Analizie raportu.

### 6. Raport wykonania

- Utwórz **nowy rekord w bazie Raporty wykonania** (szablon: [report-template.md](./report-template.md)).
- Ustaw relacje: Zlecenie builderskie, wykonany Dry-run, **Pull Request** (zsynchronizowana baza GitHub).
- Treść opisz własnymi słowami na podstawie rzeczywistego PR-a (opis, commity, diff, checki) — **nigdy nie kopiuj Description PR-a 1:1**.
- Trzon treści: callouty **„co weszło / co wyszło"** od góry do dołu po strukturze kodu.
- Pola `Zmergowano` nie wypełniasz — to rollup z PR-a; przy tworzeniu Raportu merge nie istnieje.
- Dołącz dowody: branch, SHA commitów, URL PR, wynik testów / brak testów, residual, blokady.

### 7. Merge (po decyzji `Zaakceptuj`)

- Wykonuj wyłącznie po decyzji operatora **`Zaakceptuj`** na Analizie raportu.
- Przed merge ponownie sprawdź stan PR-a: konflikt, checki, zmiany po raporcie → stop i raport blokady.
- Wykonaj merge PR-a; potwierdzeniem jest niepuste `Zmergowano` na Raporcie wykonania.
- Merge częściowy nie zamyka Zadania. Deployment to osobna decyzja operatora.

## Zakazy

- Rozszerzanie scope poza manifest dry-runu `Realizuj`
- Autoryzacja wyłącznie na podstawie GitHuba lub rozmowy
- Merge do `main` bez decyzji `Zaakceptuj`; deployment bez osobnej jawnej zgody
- Traktowanie Raportu lub statusu w Notion jako dowodu merge (dowód = `Zmergowano`)
- Nadpisywanie historii: dry-runów, Raportów wykonania, Analiz raportu (korekta = nowy rekord / nowe Zlecenie)
- Zmiana schematu Notion, norm, Custom Agenta poza zakresem
- Sekrety i dane klientów w Notion lub repozytorium

## Powiązane pliki

- [AGENTS.md](../AGENTS.md) — zasady techniczne
- [report-template.md](./report-template.md) — szablon Raportu wykonania
