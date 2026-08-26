# ncla — NeetCodeLearnApp

Persönliche Lern-App zur Vorbereitung auf technische Interviews mit den **NeetCode 150**.

Das Ziel ist ausdrücklich **nicht**, 150 Lösungen auswendig zu können. Interviews prüfen ~17 Muster.
ncla soll drei Dinge trainieren:

1. **Ein unbekanntes Problem angehen** — ein wiederholbarer Ablauf, der auch bei einer Aufgabe
   funktioniert, die man noch nie gesehen hat.
2. **Muster erkennen** — am Wortlaut und an den Constraints sofort wissen, welche Kernidee greift.
3. **Sauber lösen und erklären** — vom naiven Ansatz über den Engpass zur optimalen Lösung, laut
   gedacht, wie im Interview.

Alle Inhalte in der App sind **englisch** (Interviewsprache). Diese README und die Arbeitsanweisung
in [CLAUDE.md](CLAUDE.md) sind deutsch.

---

## Status

Frühe Phase. Vorhanden ist bislang die inhaltliche Grundlage
[`NeetCode_150_Lerngrundlage.md`](NeetCode_150_Lerngrundlage.md) — alle 150 Aufgaben in 18 Kategorien
mit Voraussetzungen, Kernidee, optimalem Ansatz, Komplexität und Fallstricken, dazu Muster-Index und
Komplexitäts-Spickzettel. Die App wird daraus aufgebaut.

---

## Start

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run tauri:dev
```

```bash
npm run validate
```

`dev` öffnet die App im Browser, `tauri:dev` im eigenen Fenster — dieselbe App, kein zweiter
Code-Pfad. `validate` prüft Typen, Content-Struktur und Tests. Die App läuft rein lokal, ohne
Backend und ohne Netzwerkzugriff.

**Als Programm installieren:** `npm run tauri:build` erzeugt unter
`src-tauri/target/release/bundle/` eine `.msi` und einen NSIS-Installer. Dafür wird einmalig die
Rust-Toolchain gebraucht (`rustup`) sowie ein C++-Linker — auf Windows aus den Visual Studio Build
Tools. Die Installer sind **nicht signiert**: Windows SmartScreen warnt beim ersten Start.

Achtung beim Wechsel zwischen Browser und Fenster: der Fortschritt liegt in `localStorage` und ist
an die Herkunft gebunden, beide teilen ihn sich **nicht**. Zum Übertragen den JSON-Export nutzen.

---

## Was die App kann

### Aufgabenseite (der Kern)

Jede der 150 Aufgaben hat eine Seite mit fester Struktur:

| Sektion | Inhalt |
|---|---|
| Statement | Aufgabe in eigenen Worten, ein Beispiel, die relevanten Constraints |
| Signals | Woran man in diesem Text das Muster erkennt |
| Brute Force | Der naive Ansatz, seine Komplexität, warum er nicht reicht |
| Insight | Die Kernidee — ein einziger Satz |
| Approach | Der optimale Weg in nummerierten Schritten, mit eingebettetem Visualizer |
| Solution | Lauffähiger Python-Code: erst Brute Force, dann optimal |
| Pitfalls | Die typischen Fehler |
| Follow-ups | Was der Interviewer als Nächstes fragt |

`/` ist eine echte Startseite, die erklärt, wozu das Ganze gut ist — die Arbeitsfläche liegt unter
`/dashboard`. Links steht dort eine einklappbare Sidebar (Ctrl+B) mit dem Kategorie-Baum als
aufklappbarer Ordnerstruktur, Fortschritt und einem Filter; auf der
Aufgabenseite hält eine mitscrollende Spalte rechts Zielkomplexität, Muster und den LeetCode-Link
im Blick. Hell und dunkel sind beide vollwertig und per Schalter umstellbar.

**Zwei Modi**, global umschaltbar:

- **Learn Mode** — sichtbar ist zunächst nur das Statement. Danach gibst du stufenweise frei:
  Zielkomplexität → Muster-Hinweis → Kernidee → Ansatz → Lösung → Fallstricke.
  Dazu ein 20-Minuten-Timer und die abhakbare Checkliste für unbekannte Probleme.
- **Reference Mode** — alles offen, Lösung eingeklappt. Zum Wiederholen.

### Muster-Visualizer

18 interaktive Visualisierungen, eine pro Muster: Two Pointer, Sliding Window, Monotoner Stack,
Binary Search (auch „on answer“), Fast/Slow Pointer, DFS/BFS, Backtracking-Baum, Union-Find,
Topologische Sortierung, Dijkstra/Prim, Heap/Top-K, DP-Tabelle (1-D und 2-D), Greedy-Scan,
Intervall-Sweep, Bit-Tricks, Hashing/Komplement.

Alle laufen als Schritt-für-Schritt-Player: Play, Einzelschritt vor und zurück, Reset,
Geschwindigkeit, eigene Eingaben. Zu jeder Aufgabe gibt es ein **Preset** — also den Visualizer,
gefüttert mit genau dem Beispiel dieser Aufgabe. Das ist die Skizze pro Problem.

### Methode und Nachschlagewerk

- **Method** — der Leitfaden „unbekanntes Problem“: Beispiele durchgehen, Constraints lesen,
  Zielkomplexität ableiten, Brute Force benennen, Engpass finden, Muster wählen, dann erst coden.
- **Patterns** — der Muster-Index mit Erkennungssignal, Visualizer und allen zugehörigen Aufgaben.
- **Cheat Sheet** — Komplexitätstabelle der Datenstrukturen, Faustregel „Constraints → Zielkomplexität“,
  und die drei Fragen für die letzten zehn Minuten vor dem Interview.

### Fortschritt (Spaced Repetition)

Nach jedem Versuch bewertest du dich von 1 bis 5. Daraus ergibt sich der nächste Termin — Basisrhythmus
sind die 3 Tage und 2 Wochen aus der Lerngrundlage, bei wiederholtem Erfolg wächst das Intervall.
Die Startseite zeigt, was heute fällig ist.

Gespeichert wird ausschließlich lokal im Browser (`localStorage`), inklusive Notizfeld pro Aufgabe.
Export und Import als JSON-Datei sind eingebaut — es gibt kein Backend, das etwas sichern könnte.

---

## Lernablauf (die Methode dahinter)

1. Aufgabe im **Learn Mode** öffnen, 20-Minuten-Timer starten, selbst versuchen.
2. Bei Blockade genau **eine** Stufe freigeben — nicht mehr. Weiterversuchen.
3. Erst danach die Lösung ansehen und **selbst implementieren**, nicht abtippen.
4. Bewerten. Bei der Wiederholung nach 3 Tagen und nach 2 Wochen reicht es, die **Kernidee** aus dem
   Kopf zu rekonstruieren. Wenn das gelingt, sitzt das Muster.

**Dosierung:** 3–4 Aufgaben pro Tag über ~7 Wochen. Zwei wirklich verstandene Aufgaben sind mehr wert
als acht abgehakte. Ein ausgefallener Tag ist kein Grund, den Plan zu kippen.

**Reihenfolge:** Kategorien 1–5 (Arrays & Hashing bis Binary Search) sind die Basis und kommen zuerst.
Danach frei. Advanced Graphs und 2-D DP zuletzt.

---

## Aufbau-Reihenfolge

| Meilenstein | Inhalt |
|---|---|
| M0 | Projekt-Setup: Vite, React, TypeScript, Tailwind, MDX, Routing, Validierungs-Skripte |
| M1 | Method, Patterns, Cheat Sheet — die generellen Inhalte, unabhängig von einzelnen Aufgaben |
| M2 | Aufgabenseite mit beiden Modi + 3 Gold-Standard-Aufgaben als Referenz für alles Weitere |
| M4 | Spaced Repetition, Review-Queue, Fortschrittsseite, Export/Import |
| M5 | Content-Befüllung Kategorie für Kategorie, in der Reihenfolge der Quelle |
| M3 | Visualizer — pro Muster nachgezogen, während der Content entsteht |
| M6 | Feinschliff: Tastaturnavigation, Volltextsuche, Command-Palette |

M4 kommt bewusst vor M3: sobald M2 steht, wird gelernt, und jede Sitzung ohne Bewertung ist
verlorene Historie. Der Visualizer-Kern steht seit dem Design-Slice, der Rest lässt sich pro Muster
nachziehen.

Quer dazu laufen Design-Durchgänge auf eigenen `design/<n>-…`-Branches. Das visuelle System —
Palette, Typografie, Sidebar, Themes — steht seit `design/1-visual-system`.

---

## ToDo (nach dem MVP)

- **Python im Browser (Pyodide):** Code-Editor pro Aufgabe mit Testfällen und sofortigem Feedback.
  Fest eingeplant, aber erst nach dem MVP — und nur, wenn die App ohne Pyodide voll funktionsfähig bleibt.
- **Python-Nachhilfe:** eigener Bereich für die Sprachmittel, die in Interviews wirklich zählen —
  `collections`, `heapq`, Slicing, Comprehensions, `functools.cache`, Rekursionslimit,
  Integer-Division bei negativen Zahlen, String-Immutability.
- Volltextsuche über alle Aufgaben.
- Mock-Interview-Modus: zufällige Aufgabe, Timer, nur das Statement.
- Statistik nach Muster statt nach Kategorie.

---

## Mitarbeit / Git

Default-Branch ist `main`, direkt darauf wird nicht committet. Jeder Slice läuft über einen eigenen
Branch `slice/<kurzname>` und endet mit einem Pull Request. Details in [CLAUDE.md](CLAUDE.md#12-git-workflow--ein-branch-pro-slice-verbindlich).

Teile dieses Projekts — Code, Inhalte und Dokumentation — sind mit
[Claude Code](https://claude.com/claude-code) entstanden.

---

## Projektdateien

| Datei | Rolle |
|---|---|
| [`NeetCode_150_Lerngrundlage.md`](NeetCode_150_Lerngrundlage.md) | Inhaltliche Quelle, deutsch, read-only |
| [`CLAUDE.md`](CLAUDE.md) | Arbeitsanweisung: Konventionen, Content-Format, Architektur |
| `src/content/` | Der englische App-Content, eine MDX-Datei pro Aufgabe |
