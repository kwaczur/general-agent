# Cykl builderski General Agent

Techniczny przebieg jednej kontrolowanej iteracji realizacji Przyjętej Decyzji. Notion przechowuje mandat, akceptacje i lifecycle; GitHub przechowuje stan techniczny.

## Przepływ

```text
Treść Przyjętej Decyzji + Elementy objęte decyzją
→ Zlecenie builderskie + Elementy objęte realizacją
→ Dry-run: Do oceny
  [Opcje 1-z-N → dokładnie jedna Wybierz]
→ operator: Aktualizuj / Realizuj
→ Branch + implementacja + testy dokładnego SHA
→ Commit + Push + Pull Request bez merge
→ Raport wykonania
→ Analiza raportu + Elementy gotowe do domknięcia
→ Efekt akceptacji
  ├─ Merge do main
  │  → kontrola driftu i PR → merge → techniczny dowód
  └─ Zachowaj jako kandydata
     → brak merge → Wersja: Kandydat
     → osobne Zadanie adaptacji
     → testy + rollback + zgoda operatora
     → promocja / switch → merge, publikacja, smoke test
```

## 1. Walidacja wejścia

- Odczytaj treść Decyzji jako szczegółowy mandat.
- Potwierdź `Lifecycle docelowy = Przyjęta` i `Dalsze postępowanie = Kandydat Zlecenia builderskiego`.
- Potwierdź `Kontrola zakresu Decyzji = OK` i `Kontrola zakresu Zlecenia = OK`.
- Sprawdź, że Elementy Zlecenia są podzbiorem Elementów Decyzji i należą do właściwego Zadania źródłowego.
- Potwierdź najnowszy Dry-run `Realizuj` oraz dokładnie jedną Opcję `Wybierz`, jeśli Opcje istnieją.
- Sprawdź manifest: cel, granice, pliki, operacje, testy, dowody i sposób wycofania.
- Sprawdź Git: remote, HEAD, bazowy SHA `origin/main`, branch i working tree.

Każdy brak lub konflikt oznacza stop i Raport blokady.

## 2. Protokół Dry-runu

- `Do oceny` — plan czeka na operatora.
- `Aktualizuj` — nie uruchamia wykonania; powstaje nowy Dry-run, poprzedni `Zastąpiony`.
- `Realizuj` — zgoda wyłącznie na dokładny manifest tej iteracji.
- Korekta techniczna lub wyjaśnienie pozostaje w tej samej Decyzji.
- Istotna zmiana celu, kierunku, granic lub Elementów wymaga nowej Decyzji z `Geneza decyzji`.

## 3. Branch i implementacja

- Utwórz branch od zweryfikowanego bazowego SHA.
- Umieść ID Zlecenia w nazwie brancha, jeśli środowisko pozwala.
- Wykonaj wyłącznie operacje manifestu.
- Zmiana planu → stop; nie improwizuj i nie rozszerzaj zakresu.

## 4. Testy

- Uruchom testy wymienione w Dry-runie.
- Zapisz dokładny `SHA przetestowany`.
- Nowy commit po testach unieważnia PASS.
- Brak testów automatycznych zapisz jawnie; nie symuluj wyniku.

## 5. Commit, push i PR

- Commit i tytuł PR zawierają ID Zlecenia w docelowym workflow.
- Otwórz PR do `main` bez merge.
- Nie traktuj opisu PR jako autoryzacji ani Raportu.

## 6. Raport wykonania

Utwórz nowy Raport i ustaw relacje do Zlecenia, wykonanego Dry-runu i zsynchronizowanego PR.

Raport musi:

- porównać każdą pozycję manifestu: planowano / wykonano / odstępstwo / dowód;
- wskazać wszystkie zmienione pliki i operacje;
- przypisać dowody do Elementów objętych realizacją;
- zapisać branch, head SHA, testowany SHA, URL PR i wyniki testów;
- ujawnić niewykonane elementy, residual, ryzyka i blokery;
- nie deklarować merge ani gotowości Elementów do domknięcia.

## 7. Analiza raportu

Analiza ocenia:

1. Czy zakres Decyzji i Zlecenia został zrealizowany?
2. Czy Raport i dowody odpowiadają dokładnemu SHA?
3. Które Elementy z zakresu Zlecenia są gotowe do domknięcia?
4. Czy rekomendacja techniczna i Efekt akceptacji są spójne?

Analiza może wskazać wyłącznie podzbiór `Elementów objętych realizacją`. Jej przyjęcie nie zmienia automatycznie Elementów ani Zadania.

## 8. Ścieżka `Merge do main`

Przed merge ponownie sprawdź:

- aktualny head SHA i zgodność z Raportem;
- przesunięcie `main` od bazowego SHA;
- konflikty, checki i nowe commity;
- zgodność `Efekt akceptacji = Merge do main`.

Nowy commit lub istotny drift → stop, ponowna analiza i testy. Faktem merge jest `merged_at` / `Merged At`, nie `closed`, boolean `merged` ani ręczny status Notion.

## 9. Ścieżka `Zachowaj jako kandydata`

Warunek przekazania:

```text
Analiza = Zaakceptuj
+ Efekt akceptacji = Zachowaj jako kandydata
+ Merge potwierdzony = false
+ SHA kandydata = SHA przetestowany
+ Raport i PR powiązane
+ Wersja docelowa powiązana
+ pakiet przekazania kompletny
→ Kandydat przyjęty
```

Pakiet przekazania obejmuje manifest zmian Custom Agenta, triggerów i permissions, instrukcję adaptacji, ograniczenia, residual oraz wymagania rollbacku. Builders nie wykonuje adaptacji, promocji ani publikacji.

## 10. Domknięcie Elementów

Raport i merge są dowodami, nie automatycznym domknięciem. Po zaakceptowanej Analizie operator lub autoryzowany agent aktualizuje wyłącznie wskazane `Elementy gotowe do domknięcia`. Pozostałe pozostają otwarte.

## Zakazy

- wykonanie bez pełnej bramki Decyzji i Zlecenia;
- rozszerzanie mandatu przez Dry-run;
- merge kandydata;
- traktowanie `closed` lub boolean `merged` jako dowodu merge;
- użycie testów po zmianie SHA;
- automatyczne domykanie Elementów lub Zadania;
- promocja runtime’u przez Buildersa;
- mutacja historii, sekretów albo danych klientów.

## Powiązane pliki

- [AGENTS.md](../AGENTS.md)
- [report-template.md](./report-template.md)
