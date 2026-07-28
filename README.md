# Cursor Decision Notifier

Małe rozszerzenie do przeglądarek Chromium na macOS. Obserwuje wyłącznie strony
`cursor.com`, wykrywa widoczne pytania i okna zatwierdzania agenta, a następnie
pokazuje natywne powiadomienie systemowe. Kliknięcie powiadomienia aktywuje
właściwe okno i kartę.

Rozszerzenie powstało głównie z myślą o agentach uruchamianych w
[Cursor Cloud](https://cursor.com/agents), gdy karta pracuje w tle.

## Instalacja na Macu

1. Pobierz to repozytorium i zapamiętaj położenie katalogu `extension`.
2. Otwórz w używanej przeglądarce:
   - Chrome: `chrome://extensions`,
   - Edge: `edge://extensions`,
   - Brave: `brave://extensions`,
   - Arc: `arc://extensions`.
3. Włącz **Tryb dewelopera**.
4. Kliknij **Załaduj rozpakowane** i wskaż katalog `extension`.
5. Przypnij rozszerzenie do paska. Kliknij jego ikonę i wybierz
   **Wyślij testowe powiadomienie**.
6. Jeżeli test nie pojawi się, włącz powiadomienia dla przeglądarki w
   **Ustawienia systemowe → Powiadomienia → Google Chrome/Arc/Edge/Brave**.

Rozszerzenie działa od razu na otwartych później stronach `cursor.com`.
Po aktualizacji kodu kliknij **Odśwież** przy rozszerzeniu na stronie
rozszerzeń i odśwież kartę Cursor.

## Co jest wykrywane

- prośby o `Approve`, `Allow`, `Confirm` i ich polskie odpowiedniki,
- okna z parami akcji, np. `Run / Cancel`,
- pytania wielokrotnego wyboru, po których agent czeka na odpowiedź.

Powiadomienie pozostaje w Centrum powiadomień do czasu reakcji. Jeśli decyzja
nadal oczekuje, przypomnienie jest ponawiane po pięciu minutach. Pomarańczowy
znacznik `!` na ikonie rozszerzenia wskazuje kartę z oczekującą decyzją.

Rozszerzenie nie zatwierdza żadnej akcji automatycznie.

## Cursor Desktop i Cursor CLI

Cursor nie udostępnia obecnie publicznego hooka emitowanego dokładnie w chwili
pokazania własnego przycisku zgody. Z tego powodu hook projektu nie może
niezawodnie odtworzyć takiego powiadomienia dla aplikacji desktopowej.

W Cursor Desktop/CLI należy włączyć wbudowane powiadomienia Cursor oraz zezwolić
na nie w ustawieniach macOS. Aktualny Cursor potrafi powiadamiać o zakończeniu
tury oraz o blokadzie na zatwierdzeniu, pytaniu lub `sudo`. Tryb wykonywania
można ustawić w **Cursor Settings → Agents → Approvals & Execution**.

To rozszerzenie jest uzupełnieniem dla interfejsu webowego Cursor Cloud. Nie
obserwuje interfejsu natywnej aplikacji Cursor ani zwykłych stron internetowych.

## Prywatność i uprawnienia

- analiza odbywa się lokalnie w przeglądarce,
- żaden tekst strony ani dane agenta nie są wysyłane do serwera,
- dostęp do stron jest ograniczony w manifeście do `cursor.com`,
- uprawnienie `tabs` służy tylko do aktywowania karty po kliknięciu
  powiadomienia,
- treść polecenia lub pytania nie trafia na ekran blokady; powiadomienie pokazuje
  jedynie rodzaj oczekiwanej akcji.

Kod nie korzysta z zewnętrznych bibliotek i nie wymaga procesu działającego w
tle poza standardowym mechanizmem rozszerzeń przeglądarki.

## Rozwój i testy

Wymagany jest Node.js 18 lub nowszy:

```bash
npm test
npm run check
```

Detektor jest oddzielony od kodu przeglądarkowego, dzięki czemu reguły
rozpoznawania decyzji mają testy jednostkowe w `tests/decision-detector.test.js`.

## Ograniczenia

Interfejs Cursor może zmienić etykiety lub strukturę HTML. Detektor nie polega
na prywatnych klasach CSS, ale po większej zmianie interfejsu może wymagać
dodania nowej etykiety w `extension/decision-detector.js`. Heurystyka celowo
preferuje brak powiadomienia zamiast alarmu dla każdego zwykłego przycisku.

Safari nie instaluje bezpośrednio rozszerzeń Manifest V3. Konwersja do Safari
Web Extension wymaga Xcode; na Macu najprostsza instalacja tego rozwiązania to
Chrome, Arc, Edge albo Brave.
