# EduGear – System Rezerwacji Sprzętu Szkolnego

## 1. Nazwa i autorzy
* **Nazwa projektu:** EduGear – System Rezerwacji Sprzętu Szkolnego
* **Autor:** Michał Zając
* **Repozytorium GitHub:** [https://github.com/michalzajac123/EduGear](https://github.com/michalzajac123/EduGear)

---

## 2. Cel aplikacji
Aplikacja jest dedykowana społeczności szkolnej (uczniom oraz opiekunom pracowni). Jej celem jest rozwiązanie problemu chaotycznej, papierowej lub ustnej rezerwacji sprzętu (np. aparatów fotograficznych, laptopów, kamer czy zestawów Arduino) oraz zapobieganie konfliktom terminowym.

* **Przykład użycia:** Uczeń potrzebuje kamery na piątkowe zajęcia koła multimedialnego. Loguje się do systemu, sprawdza dostępność sprzętu w wybranym terminie, rezerwuje go, a opiekun pracowni zatwierdza wniosek w dedykowanym panelu.

---

## 3. Zrealizowane funkcjonalności

1. **Uwierzytelnianie i autoryzacja (Auth & Security):**
   * Rejestracja nowego użytkownika z wyborem roli (**Uczeń** / **Opiekun pracowni**).
   * Bezpieczne logowanie i wylogowywanie z obsługą tokenów JWT i haszowaniem haseł algorytmem **bcrypt** (salt rounds = 10).
   * Ochrona podstron i zasobów (**ProtectedRoute**) – brak dostępu do modułów rezerwacji dla niezalogowanych użytkowników.
   * Dedykowany podgląd z uprawnieniami RBAC: Panel Opiekuna dostępny wyłącznie dla roli `caretaker`.

2. **Katalog i przeglądanie sprzętu:**
   * Dynamiczna lista sprzętu z podziałem na kategorie (*Kamery i aparaty*, *Laptopy*, *Elektronika i robotyka*, *Audio i wideo*).
   * Wyszukiwarka tekstowa w czasie rzeczywistym oraz filtry statusów dostępności (*Dostępny*, *Zarezerwowany*, *W serwisie*).
   * Szczegółowe karty urządzeń (lokalizacja, numer seryjny, specyfikacja techniczna).

3. **Rezerwacja sprzętu (Wnioskowanie):**
   * Formularz modalny z wyborem przedziału dat (`data od` – `data do`) i uzasadnieniem wypożyczenia.
   * Automatyczna walidacja dat (blokada wyboru dat z przeszłości oraz daty końcowej wcześniejszej niż początkowa).
   * Detekcja konfliktów terminowych – uniemożliwienie jednoczesnej podwójnej rezerwacji tego samego sprzętu.

4. **Zarządzanie własnymi rezerwacjami (Widok Ucznia):**
   * Lista złożonych rezerwacji z czytelnymi statusami (*Oczekuje*, *Zatwierdzona*, *Odrzucona*, *Anulowana*, *Zwrócona*).
   * Możliwość odwołania/anulowania własnej aktywnej rezerwacji przez ucznia.
   * Podgląd uwag i instrukcji odbioru wystawionych przez opiekuna pracowni.

5. **Panel Opiekuna Pracowni (Zatwierdzanie i ewidencja):**
   * Podsumowanie metryk (liczba oczekujących wniosków, wydany sprzęt, urządzenia w ewidencji).
   * Zatwierdzanie lub odrzucanie rezerwacji z opcjonalną notatką dla ucznia (np. godzina odbioru w sali).
   * Potwierdzanie zwrotu sprzętu do pracowni.
   * Dodawanie nowego sprzętu do bazy pracowni z walidacją unikalności numeru seryjnego.
   * Oznaczanie sprzętu jako będącego w serwisie/konserwacji.

---

## 4. Technologie i architektura

* **Frontend:**
  * React 19 (JavaScript / JSX)
  * Vite – szybkie środowisko deweloperskie i zoptymalizowany bundling
  * CSS3 (CSS Variables, Flexbox, CSS Grid, responsywny design mobilny/desktop)
  * Lucide React – spójny zestaw ikon interfejsu użytkownika
* **Backend:**
  * Node.js & Express.js – REST API
  * bcryptjs – kryptograficzne haszowanie haseł użytkowników
  * jsonwebtoken (JWT) – bezpieczna autoryzacja sesji w nagłówkach HTTP `Bearer`
  * CORS – bezpieczna komunikacja między frontendem a backendem
* **Baza danych:**
  * Baza plikowa JSON (`server/data/db.json`) z atomowym zapisem chroniącym przed uszkodzeniem danych.

---

## 5. Zagrożenia i zaimplementowane zabezpieczenia

| Zagrożenie / Podatność | Opis ryzyka | Zastosowane zabezpieczenie w projekcie |
| :--- | :--- | :--- |
| **Przechowywanie haseł otwartym tekstem** | Wyciek bazy danych ujawnia hasła użytkowników. | **Haszowanie haseł (bcryptjs):** Hasła są solone i haszowane przed zapisaniem w bazie danych. Hasło otwartym tekstem nigdy nie opuszcza kontrolera auth. |
| **Nieautoryzowany dostęp do danych** | Użytkownik próbuje odwołać lub zmodyfikować rezerwację innego ucznia poprzez manipulację identyfikatorem w żądaniu (`IDOR`). | **Kontrola dostępu (Authorization & RBAC):** Serwer weryfikuje, czy zalogowany użytkownik (`req.user.id`) jest właścicielem danej rezerwacji lub posiada uprawnienia opiekuna pracowni. W przeciwnym razie zwracany jest błąd `403 Forbidden`. |
| **Błędne dane w formularzu** | Przesłanie niepoprawnego przedziału czasowego rezerwacji (np. data końcowa wcześniejsza niż początkowa, rezerwacja w przeszłości). | **Walidacja dwuetapowa (Frontend + Backend):** Formularz blokuje błędne daty, a middleware `validateReservation` na backendzie weryfikuje poprawność logiczną dat i sprawdza konflikty terminów przed zapisem. |
| **Atak XSS (Cross-Site Scripting)** | Wstrzyknięcie złośliwego kodu HTML/JS w polach tekstowych (np. cel rezerwacji, nazwa sprzętu). | **Sanityzacja danych:** Sanityzator wejścia usuwa znaczniki `<>` na backendzie, a React domyślnie escapuje wszelkie renderowane zmienne JSX (całkowity brak użycia `dangerouslySetInnerHTML`). |
| **Nieautoryzowane operacje opiekuna** | Uczeń próbuje wywołać endpoint zatwierdzania rezerwacji lub dodawania sprzętu. | **Middleware `requireRole('caretaker')`:** Każda trasa administracyjna rygorystycznie sprawdza token JWT pod kątem roli użytkownika. |

---

## 6. Struktura projektu

```text
EduGear/
├── server/                         # Backend REST API
│   ├── data/
│   │   └── db.json                 # Baza danych JSON (użytkownicy, sprzęt, rezerwacje)
│   ├── controllers/                # Logika biznesowa
│   │   ├── authController.js       # Rejestracja, logowanie, profil
│   │   ├── equipmentController.js  # Pobieranie, dodawanie, edycja sprzętu
│   │   └── reservationController.js# Składanie, anulowanie, akceptacja rezerwacji
│   ├── middleware/                 # Bezpieczeństwo i walidacja
│   │   ├── auth.js                 # Weryfikacja tokenów JWT i ról użytkowników
│   │   └── validate.js             # Walidacja danych wejściowych i sanityzacja XSS
│   ├── routes/                     # Definicje tras API
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── equipmentRoutes.js      # /api/equipment/*
│   │   └── reservationRoutes.js    # /api/reservations/*
│   ├── utils/
│   │   └── db.js                   # Obsługa bezpiecznego zapisu/odczytu pliku JSON
│   └── index.js                    # Główny serwer Express (port 5000)
│
├── src/                            # Frontend React
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx  # Blokada podstron dla niezalogowanych
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Pasek nawigacyjny z profilem i stanem sesji
│   │   │   ├── Footer.jsx          # Stopka autorska
│   │   │   ├── Modal.jsx           # Uniwersalny komponent okna modalnego
│   │   │   └── NotificationToast.jsx # Powiadomienia toast w aplikacji
│   │   └── reservations/
│   │       └── ReservationModal.jsx # Formularz składania nowej rezerwacji
│   ├── context/
│   │   ├── AuthContext.jsx         # Globalny stan sesji użytkownika
│   │   └── NotificationContext.jsx # System powiadomień
│   ├── pages/
│   │   ├── HomePage.jsx            # Strona główna z prezentacją możliwości
│   │   ├── LoginPage.jsx           # Formularz logowania z szybkimi kontami testowymi
│   │   ├── RegisterPage.jsx        # Formularz rejestracji z walidacją
│   │   ├── EquipmentPage.jsx       # Katalog sprzętu z wyszukiwarką i filtrami
│   │   ├── MyReservationsPage.jsx  # Lista rezerwacji ucznia z opcją anulowania
│   │   └── CaretakerPage.jsx       # Panel opiekuna do zatwierdzania wniosków
│   ├── services/
│   │   ├── api.js                  # Klient HTTP z nagłówkami JWT
│   │   ├── authService.js
│   │   ├── equipmentService.js
│   │   └── reservationService.js
│   ├── styles/
│   │   └── main.css                # Spójny system stylów i design system
│   ├── App.jsx                     # Router podstron aplikacji
│   └── main.jsx                    # Punkt wejścia React
│
├── package.json                    # Skrypty i zależności fullstack
├── vite.config.js                  # Konfiguracja Vite i proxy do API
└── README.md
```

---

## 7. Instrukcja uruchomienia projektu

### Wymagania wstępne
* Zainstalowane środowisko **Node.js** (wersja 18 lub nowsza) oraz **npm**.

### Krok po kroku:

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/michalzajac123/EduGear.git
   cd EduGear
   ```

2. **Zainstaluj zależności projektu:**
   ```bash
   npm install
   ```

3. **Uruchom aplikację (Frontend + Backend równolegle):**
   ```bash
   npm start
   ```
   * *Alternatywnie w dwóch osobnych terminalach:*
     * Terminal 1 (Serwer API): `npm run server` (działa na `http://localhost:5000`)
     * Terminal 2 (Aplikacja React): `npm run dev` (działa na `http://localhost:5173`)

4. **Otwórz aplikację w przeglądarce:**
   * Przejdź pod adres: [http://localhost:5173](http://localhost:5173)

---

## 8. Konta demonstracyjne do testów

System posiada wstępnie przygotowane konta testowe z zaszyfrowanymi hasłami w bazie danych:

| Rola w systemie | Imię i nazwisko | Adres e-mail | Hasło | Uprawnienia |
| :--- | :--- | :--- | :--- | :--- |
| **Uczeń** | Jan Kowalski | `student@edugear.pl` | `Password123!` | Przeglądanie sprzętu, rezerwacja, anulowanie własnych rezerwacji |
| **Uczeń** | Michał Zając | `michal@edugear.pl` | `Password123!` | Przeglądanie sprzętu, rezerwacja, anulowanie własnych rezerwacji |
| **Opiekun pracowni** | Anna Nowak | `opiekun@edugear.pl` | `Password123!` | Zatwierdzanie i odrzucanie rezerwacji, potwierdzanie zwrotów, dodawanie sprzętu |

> **Wskazówka:** Na stronie logowania znajdują się przyciski szybkiego wypełnienia danych testowych (*Uczeń* / *Opiekun*), co ułatwia testowanie i prezentację projektu.
