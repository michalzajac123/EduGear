# System Rezerwacji Sprzętu Szkolnego

## 1. Nazwa i autorzy
* **Nazwa projektu:** EduGear – System Rezerwacji Sprzętu Szkolnego
* **Autor:** Michał Zając

## 2. Cel aplikacji
Aplikacja jest dedykowana społeczności szkolnej (uczniom oraz opiekunom pracowni). Jej celem jest rozwiązanie problemu chaotycznej, papierowej lub ustnej rezerwacji sprzętu (np. aparatów fotograficznych, laptopów, kamer czy zestawów Arduino) oraz zapobieganie konfliktom terminowym.
* **Przykład użycia:** Uczeń potrzebuje kamery na piątkowe zajęcia koła multimedialnego. Loguje się do systemu, sprawdza dostępność sprzętu w wybranym terminie, rezerwuje go, a opiekun pracowni zatwierdza wniosek.

## 3. Planowane funkcje (Czynności użytkownika)
1. **Przeglądanie sprzętu:** Uczeń widzi listę dostępnego sprzętu szkolnego wraz z jego opisem i statusami dostępności.
2. **Rezerwacja sprzętu:** Uczeń wybiera interesujący go sprzęt, wskazuje termin (datę od–do) i wysyła rezerwację.
3. **Zarządzanie własnymi rezerwacjami:** Uczeń widzi swoje aktywne rezerwacje i ma możliwość odwołania wybranej rezerwacji[cite: 1].
4. **Zatwierdzanie wydania (Panel Opiekuna):** Opiekun pracowni ma możliwość przeglądania nadesłanych rezerwacji i zatwierdzania wydania sprzętu.

## 4. Technologie i dane
* **Interfejs użytkownika (Frontend):** React (JavaScript / JSX), HTML5, CSS3 / Tailwind CSS (do ostylowania komponentów).
* **Obsługa danych i stan:** React State (useState, useEffect) / Context API (na potrzeby projektu semestralnego dane mogą być symulowane lokalnie lub przechowywane w prostym lokalnym API/JSON Server).
* **Dane:** Przechowywane w formie struktury JSON (użytkownicy, sprzęt, rezerwacje).

## 5. Zagrożenia i zabezpieczenia
| Zagrożenie / Podatność | Opis ryzyka | Zabezpieczenie |
| :--- | :--- | :--- |
| **Nieautoryzowany dostęp do danych** | Użytkownik próbuje odwołać lub zmodyfikować rezerwację innego ucznia poprzez manipulację identyfikatorem w żądaniu. | **Kontrola dostępu (Authorization):** Serwer / logika aplikacji weryfikuje, czy zalogowany użytkownik jest właścicielem danej rezerwacji. |
| **Błędne dane w formularzu (np. data końcowa wcześniejsza niż początkowa)** | Przesłanie niepoprawnego przedziału czasowego rezerwacji z pominięciem ograniczeń formularza. | **Walidacja po stronie serwera/logiki:** Sprawdzenie poprawności dat przed zapisaniem rezerwacji w bazie/stanie. |
| **Atak XSS (Cross-Site Scripting)** | Wpisanie kodu HTML/JS w polach tekstowych (np. w uwagach do rezerwacji), co mogłoby wykonać się u innych użytkowników. | **Sanityzacja i bezpieczne wyświetlanie:** React domyślnie zabezpiecza przed XSS poprzez escapowanie zmiennych renderowanych w JSX (unikanie używania `dangerouslySetInnerHTML`). |

## 6. Plan pracy
Projekt realizowany jest samodzielnie w następujących etapach:
* **Etap 1:** Utworzenie repozytorium, konfiguracja środowiska React, stworzenie podstawowego layoutu oraz statycznej listy sprzętu.
* **Etap 2:** Implementacja formularza rezerwacji oraz widoku rezerwacji użytkownika (funkcjonalność działająca od A do Z).
* **Etap 3:** Dodanie panelu opiekuna (zatwierdzanie) oraz implementacja mechanizmów bezpieczeństwa i walidacji.
* **Etap 4:** Testy aplikacji, uzupełnienie dokumentacji w README i przygotowanie prezentacji.

---

## 7. Instrukcja uruchomienia projektu na innym komputerze
Aby uruchomić aplikację lokalnie, wykonaj poniższe kroki:

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/michalzajac123/EduGear.git
   cd <EduGear>
