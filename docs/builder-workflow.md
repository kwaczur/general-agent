# Cykl builderski General Agent

Opis technicznego przebiegu pojedynczej zmiany. Scope i approval pochodzą z Notion; implementacja, testy i wersjonowanie — z GitHuba.

## Przepływ

```text
Zadanie (Notion)
  → Zlecenie builderskie
    → Dry run (przygotowanie)
      → Ocena operatora
        → Status: Zlecenie w realizacji  (= akceptacja konkretnej wersji dry runu)
          → Branch + implementacja + testy
            → Commit + Push + Pull Request
              → Raport w tym samym Zleceniu
                → Status: Zlecenie do oceny
                  → Ocena operatora (Przyjęte / Nieprzyjęte / Anulowano)
```

## Kroki wykonawcy

### 1. Walidacja wejścia

- Odczytaj Zlecenie, Zadanie, Projekt, wskazane materiały.
- Potwierdź Status `Zlecenie w realizacji`.
- Ustal zaakceptowaną wersję dry runu (najwyższa wersja w chwili zmiany statusu na realizację).
- Sprawdź brak driftu: cel, zakres, kryteria, pliki, uprawnienia, ryzyka, testy, rollback.
- Sprawdź Git: czyste drzewo (lub stan zgodny z planem), zgodność SHA bazowego.

### 2. Branch

- Pracuj na branchu wykonawczym wskazanym w dry runie / harnessie.
- Umieść **ID Zlecenia** w nazwie brancha, gdy to możliwe.
- Base: zwykle `main`; SHA bazowy potwierdź przed pierwszą mutacją.

### 3. Implementacja

- Wykonaj wyłącznie operacje z manifestu zaakceptowanego dry runu.
- Nie dodawaj plików, refaktorów ani „ulepszeń” poza zakresem.
- Po zmianie planu → stop, nowy dry run, ponowna akceptacja.

### 4. Testy

- Uruchom wyłącznie testy zatwierdzone w dry runie.
- Jeśli repozytorium nie definiuje testów dla danej zmiany — odnotuj brak w raporcie; nie symuluj wyniku.

### 5. Commit, push, PR

- Commit message zawiera odniesienie do ID Zlecenia.
- Push na branch wykonawczy.
- Otwórz Pull Request do `main`; **tytuł zawiera `Zlecenie #<ID>`**.
- **Bez merge** i **bez deploymentu**, chyba że dry run i osobna zgoda stanowią inaczej.

### 6. Raport

- Zapisz raport wyłącznie w bieżącym Zleceniu (szablon: [report-template.md](./report-template.md)).
- Ustaw Status na `Zlecenie do oceny`.
- Dołącz dowody: branch, SHA commitów, URL PR, wynik testów / brak testów, residual, blokady.

## Zakazy

- Rozszerzanie scope poza zaakceptowany dry run
- Approval wyłącznie na podstawie GitHuba lub rozmowy
- Merge do `main` / deployment produkcyjny bez jawnej zgody
- Zmiana schematu Notion, norm bundle, Custom Agenta poza zakresem
- Sekrety i dane klientów w Notion lub repozytorium

## Powiązane pliki

- [AGENTS.md](../AGENTS.md) — zasady techniczne
- [report-template.md](./report-template.md) — szablon dowodów
