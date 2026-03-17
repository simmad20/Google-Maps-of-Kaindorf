# Maps of Kaindorf

**Maps of Kaindorf** ist ein Indoor-Navigationssystem, das speziell für Gebäude entwickelt wurde, in denen klassisches GPS nicht funktioniert. Mithilfe einer mobilen App können Nutzer:innen Personen, Geräte und andere Objekte präzise innerhalb eines Gebäudes lokalisieren – z. B. beim Elternsprechtag an der HTBLA Kaindorf. Ein Admin-Dashboard ermöglicht die flexible Verwaltung aller Inhalte, ohne dass technisches Wissen oder Codeänderungen notwendig sind.

Das Admin-Dashboard ist offiziell erreichbar unter: **https://kainfind.uber.space/**

---

## Die Teammitglieder

| Name | GitHub | Aufgabenbereich |
|------|--------|-----------------|
| [Franca Harzl](https://github.com/franca4) | @franca4 | Admin-Dashboard – Architektur, Backend, Datenmodell (MongoDB) |
| [Robert Raminger](https://github.com/ramroz19) | @ramroz19 | Mobile App – React Native, UI/UX, QR-Code-Onboarding |
| [Mark Simo](https://github.com/simmad20) | @simmad20 | Indoor-Tracking – Standortbestimmung, skalierbare Kartenposition |

---

## Inhaltsverzeichnis

- [Projektbeschreibung](#projektbeschreibung)
- [Onboarding via QR-Code](#onboarding-via-qr-code)
- [Admin-Dashboard](#admin-dashboard)
- [Tech-Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Deploy auf Uberspace](#deploy-auf-uberspace)

---

## Projektbeschreibung

Da in vielen Gebäuden eine präzise Standortbestimmung mit klassischem GPS nicht möglich ist, zielt Maps of Kaindorf darauf ab, eine Indoor-Navigationslösung zu bieten. Über ein **Admin-Dashboard** werden Karten, Räume, Objekttypen und Events verwaltet. Die **mobile App** ermöglicht es Nutzer:innen, gesuchte Objekte (z. B. Lehrer:innen, Geräte, Räume) auf einem Grundriss zu finden und dorthin navigiert zu werden.

Das System ist mandantenfähig (Multi-Tenant): Verschiedene Organisationen (z. B. Schulen, Einkaufszentren) können das System unabhängig voneinander nutzen – jede mit ihren eigenen Daten, Karten und Objekten.

---

## Onboarding via QR-Code

Das Onboarding ist so gestaltet, dass Nutzer:innen **ohne Account, ohne Tippaufwand und in wenigen Sekunden** in die App einsteigen können.

### So funktioniert es:

1. **App öffnen** – beim ersten Start erscheint der Welcome-Screen mit dem Splash-Screen der HTBLA Kaindorf.
2. **Kameraberechtigung erteilen** – die App fragt einmalig nach Zugriff auf die Kamera.
3. **QR-Code scannen** – den vom Admin bereitgestellten QR-Code (z. B. ausgehängt im Eingangsbereich) einscannen.
4. **Automatischer Login** – die App sendet den `join_code` aus dem QR-Code an das Backend, das einen anonymen App-Account anlegt und einen JWT-Token zurückgibt.
5. **Fertig** – die App ist eingeloggt und zeigt direkt die Inhalte des jeweiligen Tenants an.

> **Hinweis:** Für die HTL Kaindorf gibt es zusätzlich den Button „Kaindorf joinen", der den Scan überspringt und direkt zum Tenant der Schule verbindet. Dieser ist primär für Testzwecke gedacht.

### Was passiert im Hintergrund?

- Der QR-Code enthält den `join_code` des Tenants.
- Die App sendet diesen Code an den Endpunkt `POST /api/app/join`.
- Das Backend erstellt einen `APP_User`-Account und liefert einen JWT-Token zurück.
- Dieser Token wird lokal gespeichert und für alle weiteren API-Anfragen verwendet.
- Beim nächsten App-Start wird der Token geprüft – ist er noch gültig, entfällt der QR-Scan.

### QR-Code generieren (als Admin)

Der QR-Code für den Tenant wird automatisch im Admin-Dashboard generiert und ist unter **Tenant-Einstellungen** abrufbar. Einfach herunterladen und im Gebäude aushängen.

---

## Admin-Dashboard

Das Admin-Dashboard ist erreichbar unter: **https://kainfind.uber.space/**

### Funktionen

**Objekttypen verwalten**
Admins können eigene Objekttypen (z. B. „Lehrer", „Beamer", „Stand") mit individuellen Attributen definieren. Für jedes Attribut werden Key, Label, Datentyp (`Text`, `Number`, `Image`) sowie Anzeigebereiche (`Card Display`, `Map Marker`, etc.) konfiguriert.

**Objekte erstellen & Räumen zuweisen**
Basierend auf einem Objekttyp werden konkrete Objekte angelegt (z. B. einzelne Lehrer:innen mit Name und Foto). Diese können per **Drag-and-Drop** auf der Kartenansicht einem Raum zugewiesen werden – eventbasiert, sodass dasselbe Objekt bei verschiedenen Events unterschiedlichen Räumen zugeordnet werden kann.

**Karten & Räume**
Grundrisse werden als Bild hochgeladen. Räume werden auf dem Grundriss platziert.

**Navigationsknoten**
Für die App-Navigation können Knoten direkt auf dem Kartenbild platziert, verbunden und verwaltet werden. Stockwerksübergreifende Verbindungen werden über Treppenknoten realisiert.

**Tenant-Einstellungen**
- QR-Code für das App-Onboarding abrufen
- Tenant-Name und Passwort ändern
- Weitere Admin-Accounts einladen und deren Rollen verwalten (`ADMIN`, `ADMIN_VIEWER`)

### Rollen

| Rolle | Beschreibung |
|-------|-------------|
| `SUPER_ADMIN` | Vollzugriff inkl. Tenant-Einstellungen und Nutzerverwaltung |
| `ADMIN` | Kann Objekte, Räume, Events und Karten verwalten |
| `ADMIN_VIEWER` | Nur-Lese-Zugriff auf das Dashboard |

---

## Tech-Stack

| Bereich | Technologie |
|---------|-------------|
| Mobile App | React Native (Expo) |
| Admin-Dashboard (Frontend) | React |
| Backend | Spring Boot (Java) |
| Datenbank | MongoDB |
| Authentifizierung | JWT (Access + Refresh Token) |
| Hosting Dashboard | Uberspace (Apache) |

---

*Diplomarbeit – HTBLA Kaindorf an der Sulm, Abteilung Informatik, AHIF21 – 2025/2026*  
*Betreuer: Dipl.-Ing. Christoph Kohlweg*
