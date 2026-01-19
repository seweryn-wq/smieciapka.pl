# Dokumentacja aplikacji smieciapka.pl

## Spis treści
1. [Opis aplikacji](#opis-aplikacji)
2. [Stos technologiczny](#stos-technologiczny)
3. [Struktura projektu](#struktura-projektu)
4. [Architektura](#architektura)
5. [Komponenty aplikacji](#komponenty-aplikacji)
6. [Model danych](#model-danych)
7. [Kategorie odpadów](#kategorie-odpadów)
8. [Obsługiwane lokalizacje](#obsługiwane-lokalizacje)
9. [Service Worker i tryb offline](#service-worker-i-tryb-offline)
10. [Analityka](#analityka)
11. [Instalacja PWA](#instalacja-pwa)
12. [Konfiguracja serwera](#konfiguracja-serwera)

---

## Opis aplikacji

**smieciapka.pl** to progresywna aplikacja webowa (PWA) służąca do wyświetlania harmonogramu odbioru odpadów oraz zasad segregacji dla mieszkańców gminy Piaseczno i okolic. Aplikacja pokazuje jakie odpady są odbierane dzisiaj i jutro, umożliwia przeglądanie pełnego harmonogramu oraz dostarcza szczegółowych informacji o tym, jak segregować odpady.

### Główne funkcje:
- Wyświetlanie odpadów odbieranych dzisiaj i jutro
- Pełny harmonogram w widoku modalnym (z zielonym separatorem miesięcy)
- **Zasady segregacji odpadów** w interaktywnym widoku modalnym (uruchamiany ikoną lupy 🔍)
- Wybór lokalizacji (miejscowość + ulica)
- Górne menu (lokalizacja) i dolne menu (przyciski akcji) są przypięte do krawędzi ekranu.
- Ikony odpadów dynamicznie skalują się, aby mieścić się w jednej linii.
- Praca w trybie offline (Service Worker)
- Możliwość instalacji na ekranie głównym urządzenia
- Automatyczna aktualizacja o północy

---

## Stos technologiczny

| Technologia | Zastosowanie |
|-------------|--------------|
| HTML5 | Struktura stron |
| CSS3 | Stylowanie (inline w plikach HTML) |
| Vanilla JavaScript | Logika aplikacji (bez frameworków) |
| JSON | Format danych (harmonogramy, zasady segregacji) |
| Service Worker | Obsługa offline i cache |
| Web App Manifest | Konfiguracja PWA |
| Apache (.htaccess) | Konfiguracja serwera |

---

## Struktura projektu

```
smieciapka.pl/
├── index.html                    # Strona główna aplikacji
├── settings.html                 # Strona ustawień
├── sw.js                         # Service Worker
├── manifest.json                 # Manifest PWA
├── .htaccess                     # Konfiguracja Apache
├── harmonogram-definicje.json    # Mapowanie lokalizacji na harmonogramy
├── zasady.json                   # Zasady segregacji odpadów (nowy plik)
│
├── harmonograms/                 # Katalog z harmonogramami (31 plików)
│   ├── A.json ... P.json         # Harmonogramy A-P
│   ├── Q.json ... Z.json         # Harmonogramy Q-Z
│   ├── Z1.json ... Z6.json       # Harmonogramy Z1-Z6
│   └── manifest.json             # Indeks harmonogramów
│
├── assets/                       # Zasoby statyczne
│   ├── favicon.png               # Ikona strony
│   ├── icon-192x192.png          # Ikona PWA (mała)
│   ├── icon-512x512.png          # Ikona PWA (duża)
│   ├── zmieszane.png             # Ikona - odpady zmieszane
│   ├── sztuczne.png              # Ikona - metale i tworzywa
│   ├── papier.png                # Ikona - papier
│   ├── szklo.png                 # Ikona - szkło
│   ├── bio.png                   # Ikona - odpady BIO
│   ├── gabaryty.png              # Ikona - odpady wielkogabarytowe
│   ├── choinki.png               # Ikona - choinki
│   └── brak.png                  # Ikona - brak odbioru
│
└── wsad/                         # Źródłowe obrazy harmonogramów (PNG)
    └── Harmonogram_*.png
```

---

## Architektura

### Przepływ danych

```
┌─────────────────┐     ┌──────────────────────────┐     ┌─────────────────┐
│   localStorage  │────▶│  harmonogram-definicje   │────▶│  harmonograms/  │
│  (selectedTown, │     │        .json             │     │    [ID].json    │
│  selectedStreet)│     │  (mapowanie lokalizacji) │     │  (daty odbioru) │
└─────────────────┘     └──────────────────────────┘     └─────────────────┘
        │                          │                            │
        └──────────────────────────┼────────────────────────────┘
                                   ▼
                          ┌─────────────────┐
                          │   index.html    │
                          │  (renderowanie) │
                          └─────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │    zasady.json  │
                          │(dane dla modala)│
                          └─────────────────┘
```

### Logika wyboru harmonogramu

1. Użytkownik wybiera miejscowość w `settings.html`
2. Jeśli miejscowość ma `streetRules`, użytkownik wybiera ulicę
3. Wybór zapisywany jest w `localStorage`
4. `index.html` odczytuje wybór i mapuje go na `scheduleId`
5. Ładowany jest odpowiedni plik harmonogramu

---

## Komponenty aplikacji

### index.html (Strona główna)

**Odpowiedzialność:** Wyświetlanie harmonogramu odbioru odpadów oraz zasad segregacji.

**Kluczowe funkcje JavaScript:**

| Funkcja | Opis |
|---------|------|
| `loadDefinitions()` | Ładuje plik `harmonogram-definicje.json` |
| `loadSegregationRules()` | Ładuje plik `zasady.json` z zasadami segregacji. |
| `getScheduleIdForLocation(town, street)` | Mapuje lokalizację na ID harmonogramu |
| `loadSchedule(scheduleId)` | Ładuje plik harmonogramu |
| `getWasteForDate(schedule, date)` | Zwraca typy odpadów dla danej daty |
| `displayWasteIcons(containerId, wasteTypes)` | Renderuje ikony odpadów (z dynamicznym skalowaniem, jeśli jest więcej niż 1 typ) |
| `renderPage()` | Główna funkcja renderująca stronę |
| `generateFullScheduleHTML()` | Generuje HTML pełnego harmonogramu. |
| `generateSegregationInfoHTML()` | Generuje HTML dla modala z zasadami segregacji w formie rozwijanej listy. |
| `initializeApp()` | Inicjalizacja aplikacji (ładuje definicje harmonogramów i zasady segregacji). |

**Elementy UI:**
- Górne menu z nazwą miejscowości i ulicy: przypięte do góry (sticky), wyśrodkowane, z zieloną linią oddzielającą od treści. Tło szare.
- Sekcja "Dzisiaj" z ikonami odpadów (tło białe)
- Sekcja "Jutro" z ikonami odpadów (tło białe)
- Dolne menu z przyciskami akcji: kalendarz (📅), **wyszukiwanie/zasady (🔍)**, ustawienia (⚙️) - przypięte do dołu (sticky), z zielonymi obwódkami dla ikon i zieloną linią oddzielającą od treści. Tło szare.
- Modal z pełnym harmonogramem.
- **Modal z zasadami segregacji:** zawiera rozwijaną listę (`<details>`) dla każdej kategorii odpadów, co ułatwia nawigację.

### settings.html (Strona ustawień)

**Odpowiedzialność:** Konfiguracja lokalizacji użytkownika

**Kluczowe funkcje JavaScript:**

| Funkcja | Opis |
|---------|------|
| `initializeSettings()` | Inicjalizacja strony ustawień |
| `populateTownSelector()` | Wypełnia listę miejscowości |
| `populateStreetSelector(townData)` | Wypełnia listę ulic dla wybranej miejscowości |
| `setupEventListeners()` | Ustawia nasłuchiwanie zdarzeń |
| `showFeedback(message, type)` | Wyświetla komunikat zwrotny |

**Elementy UI:**
- Dropdown wyboru miejscowości
- Dropdown wyboru ulicy (warunkowy)
- Przycisk "Zapisz i wróć"
- Sekcja informacyjna o aplikacji

### sw.js (Service Worker)

**Odpowiedzialność:** Obsługa cache i trybu offline

**Strategia cache:** Network-first (najpierw sieć, potem cache)

**Nazwa cache:** `waste-schedule-v3`

**Cachowane zasoby:**
```javascript
const ASSETS = [
    '/',
    '/index.html',
    '/settings.html',
    '/manifest.json',
    '/zasady.json', // Dodano do cache
    '/assets/favicon.png',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/assets/zmieszane.png',
    '/assets/sztuczne.png',
    '/assets/papier.png',
    '/assets/szklo.png',
    '/assets/bio.png',
    '/assets/gabaryty.png',
    '/assets/choinki.png',
    '/assets/brak.png'
];
```

**Zdarzenia:**
- `install` - Pre-cache zasobów statycznych
- `fetch` - Przechwytywanie żądań (network-first)
- `activate` - Czyszczenie starych cache'y

---

## Model danych

### harmonogram-definicje.json

Plik mapujący miejscowości i ulice na identyfikatory harmonogramów.

```json
{
  "miejscowosci": {
    "NAZWA_MIEJSCOWOŚCI": {
      "defaultScheduleId": "A",
      "streetRules": [
        {
          "scheduleId": "B",
          "streets": ["Ulica 1", "Ulica 2"]
        }
      ]
    }
  }
}
```

| Pole | Typ | Opis |
|------|-----|------|
| `defaultScheduleId` | string \| null | Domyślny harmonogram dla miejscowości |
| `streetRules` | array | Lista wyjątków dla konkretnych ulic |
| `streetRules[].scheduleId` | string | ID harmonogramu dla ulic |
| `streetRules[].streets` | array | Lista ulic objętych tym harmonogramem |

### harmonograms/[ID].json

Plik harmonogramu z datami odbioru odpadów.

```json
{
  "id": "A",
  "description": "BOGATKI, GROCHOWA, JAZGARZEW...",
  "dates": {
    "zmieszane": ["2025-12-05", "2025-12-19", ...],
    "sztuczne": ["2025-12-11", "2025-12-20", ...],
    /* ... inne kategorie ... */
  }
}
```

| Pole | Typ | Opis |
|------|-----|------|
| `id` | string | Identyfikator harmonogramu (A-Z, Z1-Z6) |
| `description` | string | Opis lokalizacji objętych harmonogramem |
| `dates` | object | Obiekt z datami dla każdej kategorii odpadów |
| `dates.[kategoria]` | array | Tablica dat w formacie ISO (YYYY-MM-DD) |

### zasady.json

Plik zawierający zasady segregacji dla różnych kategorii odpadów.

```json
[
  {
    "title": "ODPADY Z METALI I TWORZYW SZTUCZNYCH",
    "WRZUCAMY": "puste i zgniecione butelki...",
    "NIE WRZUCAMY": "butelek i opakowań po olejach...",
    "description": null
  },
  {
    "title": "ODPADY TEKSTYLNE I ODZIEŻ",
    "description": "ubrania, buty, firany... nie wrzucamy do odpadów zmieszanych."
  }
]
```

| Pole | Typ | Opis |
|------|-----|------|
| `title` | string | Nazwa kategorii odpadów |
| `WRZUCAMY` | string \| null | Opis co należy wrzucać (jeśli dotyczy) |
| `NIE WRZUCAMY`| string \| null | Opis czego nie należy wrzucać (jeśli dotyczy) |
| `description`| string \| null | Dodatkowy opis lub informacja ogólna |

---

## Kategorie odpadów

| Klucz | Nazwa | Ikona |
|-------|-------|-------|
| `zmieszane` | Odpady zmieszane | assets/zmieszane.png |
| `sztuczne` | Metale i tworzywa sztuczne | assets/sztuczne.png |
| `papier` | Papier | assets/papier.png |
| `szklo` | Szkło | assets/szklo.png |
| `bio` | Odpady BIO | assets/bio.png |
| `gabaryty` | Odpady wielkogabarytowe | assets/gabaryty.png |
| `choinki` | Choinki (sezonowo) | assets/choinki.png |

---

## Obsługiwane lokalizacje

### Miejscowości z pojedynczym harmonogramem (17)

| Miejscowość | Harmonogram |
|-------------|-------------|
| ANTONINÓW | I |
| BASZKÓWKA | K |
| BOGATKI | A |
| GROCHOWA | A |
| HENRYKÓW UROCZE | O |
| JASTRZĘBIE | C |
| JAZGARZEW | A |
| JULIANÓW | R |
| KAMIONKA | H |
| KULESZÓWKA | I |
| ŁBISKA | A |
| MIESZKOWO | I |
| NOWINKI | B |
| ORZESZYN | E |
| PĘCHERY | A |
| PILAWA | E |
| i inne... | ... |

### Miejscowości z wieloma harmonogramami

**PIASECZNO** - 12 różnych harmonogramów (D, H, L, M, N, P, T, X, Y, Z, Z1-Z6)

**JÓZEFOSŁAW** - 7 różnych harmonogramów (Q, R, S, T, U, V, Y)

**Inne z podziałem na ulice:** Bobrowiec, Chojnów, Chylice, Głosków, Gołków, Jesówka, Runów, Wólka Kozodawska, Wólka Pracka, Zalesie Górne, Żabieniec

---

## Service Worker i tryb offline

### Strategia cachowania

```
Żądanie HTTP
     │
     ▼
┌─────────┐    sukces    ┌─────────────┐
│  Sieć   │─────────────▶│   Odpowiedź │
└─────────┘              │   + update  │
     │                   │    cache    │
     │ błąd              └─────────────┘
     ▼
┌─────────┐
│  Cache  │─────────────▶ Odpowiedź z cache
└─────────┘
```

### Wersjonowanie cache

Cache jest wersjonowany (`waste-schedule-v3`). Przy aktualizacji:
1. Nowy Service Worker instaluje się z nową wersją cache
2. Przy aktywacji stare cache'y są usuwane
3. Nowy SW przejmuje kontrolę nad klientami

---

## Analityka

### Google Analytics

- **ID:** G-KRZE8JPFWC
- **Biblioteka:** gtag.js
- **Cel:** Statystyki odwiedzin

### PostHog

- **ID:** phc_UzC9KRutGT20jzRMgsQRmjQZDp1sdqhTjNMxFDUGvXA
- **Host API:** eu.i.posthog.com
- **Cel:** Analiza zachowań użytkowników, feature flags

---

## Instalacja PWA

### manifest.json

```json
{
    "name": "Harmonogram Odbioru Odpadów",
    "short_name": "Odpady",
    "description": "Harmonogram odbioru odpadów w Twojej lokalizacji",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#ffffff",
    "icons": [
        { "src": "assets/icon-192x192.png", "sizes": "192x192" },
        { "src": "assets/icon-512x512.png", "sizes": "512x512" }
    ]
}
```

### Instrukcja instalacji

**iOS (Safari):**
1. Otwórz stronę w Safari
2. Dotknij ikony "Udostępnij"
3. Wybierz "Dodaj do ekranu początkowego"

**Android (Chrome):
1. Otwórz stronę w Chrome
2. Dotknij menu (⋮)
3. Wybierz "Dodaj do ekranu głównego"

---

## Konfiguracja serwera

### .htaccess (Apache)

Plik `.htaccess` konfiguruje:

1. **Typy MIME:**
   ```apache
   AddType application/manifest+json manifest.json
   ```

2. **Kompresja GZIP:**
   - Włączona dla HTML, CSS, JS, JSON

3. **Nagłówki bezpieczeństwa:**
   - HSTS (max-age=31536000)
   - Service-Worker-Allowed: /

4. **Cache-Control:**
   - Zasoby statyczne: max-age=31536000 (1 rok)
   - manifest.json: no-cache
   - sw.js: no-cache

5. **Przekierowanie HTTPS:**
   - Automatyczne przekierowanie HTTP → HTTPS

---

## Ważność danych

Harmonogramy zawierają daty od **grudnia 2025** do **listopada 2026**.

---

## Kontakt

Email: n2rage@gmail.com

---

*Dokumentacja wygenerowana: styczeń 2026, Zaktualizowano: 19 stycznia 2026*