# CLAUDE.md — Arbeitsanweisung für NCLA

NCLA (NeetCodeLearnApp) ist die persönliche Lern-App von Tim zur Vorbereitung auf technische
Interviews mit den NeetCode-150-Aufgaben. Einziger Nutzer, kein Deployment, kein Team.
Diese Datei ist verbindlich für jede Session in diesem Repo.

---

## 1. Sprachregel (wichtig, keine Ausnahmen)

| Was | Sprache |
|---|---|
| Gespräch mit dem Nutzer, CLAUDE.md, README.md | **Deutsch** |
| Alles in `src/` — UI-Strings, Content (MDX), Code-Kommentare, Commit-Messages, Dateinamen | **Englisch** |
| `NeetCode_150_Lerngrundlage.md` | Deutsch (Quelle, wird nicht verändert) |

Die App ist bewusst komplett englisch: Interviews finden auf Englisch statt, und die Fachbegriffe
sollen im Kopf englisch abgelegt sein. Niemals deutsche Strings in die App schreiben.

---

## 2. Ausgangslage und Rollen der Dateien

- `NeetCode_150_Lerngrundlage.md` — **die inhaltliche Quelle der Wahrheit.** 1194 Zeilen, alle 150
  Aufgaben in 18 Kategorien mit *Voraussetzungen · Kernidee · Optimal · Laufzeit · Fallstricke*,
  dazu Muster-Index (17 Muster), Komplexitäts-Spickzettel und Interview-Anhang.
  **Read-only.** Nicht umschreiben, nicht übersetzen, nicht löschen — sie ist das Referenzdokument,
  gegen das der englische Content geprüft wird.
- `src/content/**` — der daraus erzeugte, englische, erweiterte App-Content. Übersetzung ist das
  Minimum; jede Aufgabe wird zusätzlich um Statement, Brute Force, Lösungscode und Follow-ups ergänzt.
- Wenn Quelle und App-Content sich widersprechen: die Quelle gewinnt inhaltlich, es sei denn sie ist
  nachweislich falsch — dann den Widerspruch im Antworttext ansprechen, nicht stillschweigend abweichen.

---

## 3. Was der Nutzer kann und was nicht

- Solide: Algorithmen- und Datenstruktur-Grundlagen, Python.
- Nicht vorhanden: Erfahrung mit LeetCode-Aufgaben, Mustererkennung, Interview-Kommunikation.

Daraus folgt für allen Content:
- Datenstrukturen **nicht** von Null erklären („was ist eine Hash-Map“ → weglassen).
- Erklären, **warum genau dieses Muster** hier greift und **an welchem Signal in der Aufgabe** man das
  erkennt. Das ist der eigentliche Lerninhalt.
- Immer den Weg zeigen: naive Lösung → Komplexität benennen → Engpass identifizieren → optimieren.
  Das ist gleichzeitig das, was im Interview laut gesagt werden muss.
- Python-Sprachdetails nur erwähnen, wenn sie eine Fallgrube sind (`int(a/b)` vs. `//`,
  `tuple()` als hashbarer Key, `heapq` ist ein Min-Heap).

---

## 4. Tech-Stack

- **Vite + React 19 + TypeScript** (strict), lokal via `npm run dev`.
- **React Router** für Routing.
- **Tailwind CSS v4** (`@tailwindcss/vite`) fürs Styling. Keine UI-Library.
- **MDX** für Content: `@mdx-js/rollup`, Frontmatter über `remark-frontmatter` +
  `remark-mdx-frontmatter`, Syntax-Highlighting build-time über `@shikijs/rehype` (kein Highlighter
  zur Laufzeit).
- **Vitest** für Tests (SRS-Logik, Visualizer-`buildSteps`, Content-Validierung).
- State: kein Redux/Zustand. Ein kleiner Store in `src/lib/store.ts` (Modul + `useSyncExternalStore`),
  Persistenz in `localStorage`.
- Keine Backend-Komponente, keine Netzwerkaufrufe zur Laufzeit. Die App muss offline funktionieren.
- **Schriften:** IBM Plex Sans / Mono / Serif, über `@fontsource` aus `node_modules` gebündelt.
  „Keine externen Fonts/CDNs" heißt *kein Netzwerkzugriff zur Laufzeit* — mitgelieferte
  npm-Schriften erfüllen das und sind erwünscht.

Abhängigkeiten sparsam halten. Vor dem Hinzufügen eines Pakets kurz begründen, warum es sich lohnt.

---

## 5. Verzeichnisstruktur

```
NCLA/
├── CLAUDE.md
├── README.md
├── NeetCode_150_Lerngrundlage.md      # Quelle, read-only
├── index.html
├── package.json / vite.config.ts / tsconfig.json
├── scripts/
│   ├── validate-content.ts            # Frontmatter, Pflichtsektionen, Pattern-/Viz-Referenzen
│   └── build-index.ts                 # erzeugt src/data/generated/index.ts
└── src/
    ├── main.tsx, App.tsx
    ├── routes/
    │   ├── Home.tsx                   # Dashboard: heute fällig, Fortschritt, Weiterlernen
    │   ├── Method.tsx                 # "Unbekanntes Problem" — der Leitfaden
    │   ├── Patterns.tsx               # Muster-Index (17), Erkennungssignale
    │   ├── PatternDetail.tsx          # ein Muster + sein Visualizer + zugehörige Aufgaben
    │   ├── Category.tsx               # eine der 18 Kategorien
    │   ├── Problem.tsx                # die Aufgabenseite (Kern der App)
    │   ├── Review.tsx                 # SRS-Queue "heute fällig"
    │   ├── Progress.tsx               # Statistik pro Kategorie/Muster
    │   └── CheatSheet.tsx             # Komplexitätstabelle + 10-Minuten-Anhang
    ├── components/                    # RevealStage, ModeToggle, CodeBlock, Timer, RatingBar …
    ├── visualizers/
    │   ├── core/                      # StepPlayer, useStepper, ArrayTrack, GraphCanvas, Grid, types.ts
    │   └── <pattern>/                 # pro Muster: steps.ts (pure), View.tsx, presets.ts, steps.test.ts
    ├── content/
    │   ├── problems/<category-slug>/<nn>-<slug>.mdx
    │   ├── patterns/<pattern-slug>.mdx
    │   └── method/*.mdx
    ├── data/
    │   ├── categories.ts              # 18 Kategorien, Reihenfolge wie in der Quelle
    │   ├── patterns.ts                # 17 Muster + Erkennungssignal + Visualizer-Slug
    │   └── generated/index.ts         # aus dem Frontmatter gebaut, nicht von Hand editieren
    ├── lib/                           # srs.ts, storage.ts, store.ts, mdx.ts
    └── styles/
```

---

## 6. Content-Format: eine MDX-Datei pro Aufgabe

Dateiname: `src/content/problems/<category-slug>/<nn>-<slug>.mdx`,
z. B. `arrays-hashing/03-two-sum.mdx`. `nn` ist die Position innerhalb der Kategorie aus der Quelle.

### Frontmatter (alle Felder Pflicht, außer wo vermerkt)

```yaml
---
id: "1.3"                              # Nummer aus der Lerngrundlage
slug: two-sum
title: Two Sum
leetcode: 1
url: https://leetcode.com/problems/two-sum/
difficulty: Easy                       # Easy | Medium | Hard
premium: false
category: arrays-hashing
patterns: [hashing-complement]         # Slugs aus data/patterns.ts, mind. einer
prerequisites: ["Hash map value → index"]
targetComplexity: { time: "O(n)", space: "O(n)" }
visualizer: { name: hashing-complement, preset: two-sum }   # optional
status: complete                       # draft | complete
---
```

### Body — feste Sektionsfolge, jede Sektion eine Komponente

```mdx
<Statement>       Aufgabe in eigenen Worten, 1 Beispiel, die relevanten Constraints.
<Signals>         Welche Wörter/Constraints verraten das Muster. 2–4 Stichpunkte.
<BruteForce>      Der naive Ansatz + seine Komplexität + warum er nicht reicht.
<Insight>         Die Kernidee. Genau EIN Satz. Aus der Quelle übersetzt und geschärft.
<Approach>        Der optimale Weg in nummerierten Schritten. Hier <Viz .../> einbetten.
<Solution>        Python. Erst `variant="brute"`, dann `variant="optimal"`.
<Pitfalls>        Die Fallstricke aus der Quelle, englisch, ergänzt.
<FollowUps>       Typische Interview-Rückfragen mit kurzer Antwort.
```

Regeln:
- Sektionsreihenfolge ist fest — der Reveal-Mechanismus hängt daran.
- `<Insight>` ist **ein** Satz. Wenn er länger wird, ist die Idee noch nicht verstanden.
- `<Solution>` enthält lauffähigen Python-Code mit LeetCode-Signatur (`class Solution:` / `def …`).
  Kommentare nur an den nicht-offensichtlichen Zeilen, nicht Zeile für Zeile.
- Komplexität steht als Kommentarzeile über jeder Lösung: `# O(n) time, O(n) space`.
- Kein Content ohne `status: complete` gilt als fertig; `draft` ist erlaubt und wird in der UI markiert.

---

## 7. Lern-UX: zwei Modi

Global umschaltbar (persistiert), Zustand in `store.ts`:

- **Learn Mode** (Default): sichtbar sind nur `<Statement>` und die Constraints. Danach gibt der Nutzer
  stufenweise frei:
  `1 Target complexity → 2 Pattern hint (<Signals>) → 3 Insight → 4 Approach → 5 Solution → 6 Pitfalls + Follow-ups`.
  Jede Stufe ist ein eigener Klick, die freigegebene Stufe wird pro Aufgabe gespeichert.
  Auf der Seite läuft optional der 20-Minuten-Timer und daneben steht die abhakbare Checkliste aus
  `Method` (Beispiele durchgehen → Constraints → Zielkomplexität → Brute Force → Engpass → Muster).
- **Reference Mode**: alles offen, `<Solution>` eingeklappt. Zum schnellen Wiederholen.

Der Modus darf niemals versehentlich Inhalte spoilern — beim Rendern gilt: was nicht freigegeben ist,
wird gar nicht erst ins DOM gerendert (nicht nur per CSS versteckt).

---

## 8. Design-System (verbindlich)

Richtung: warmes Papier hell, warmes Schwarz dunkel — Abstammung der Vitesse-Editor-Themes, damit
Shikis Code-Ausgabe und die UI dieselbe Palette teilen. Zwei vollständige Themes, umschaltbar
(`light | dark | system`), aufgelöst zu `data-theme` auf `<html>` durch das Inline-Skript in
`index.html` **vor** dem ersten Paint.

Alle Farben kommen aus `src/styles/tokens.css` und werden in `index.css` via `@theme inline` auf
Tailwind gemappt. **Nie eine Farbe direkt in eine Komponente schreiben** — nur Tokens:
`bg` · `surface` · `surface-2` · `line` · `line-strong` · `ink` · `ink-muted` · `ink-faint` ·
`accent` · `accent-soft` · `danger`.

Regeln, an die sich jede neue Komponente hält:

- **Ränder statt Schatten.** 1px-Hairlines trennen Bereiche; Schatten nur für echte Overlays.
- **Radius maximal 6px** (`rounded-lg` ist hier 6px). Nichts runder.
- **Eine Akzentfarbe, sparsam:** aktiver Navigationseintrag, Links, Fokusring, Insight-Kante.
  Sonst nichts. `danger` ausschließlich für Hard.
- **Schwierigkeit über Betonung, nicht über Farbe:** Easy = `ink-faint`, Medium = `ink`,
  Hard = `danger`. Ein bernsteinfarbenes „Medium" wäre vom Ocker-Akzent nicht zu unterscheiden.
- **Keine Farbe pro Muster.** Muster-Chips sind Mono-Text in einer `surface-2`-Pille.
- **Monospace bedeutet etwas:** Komplexität, IDs, LC-Nummern, Zähler, Sektionslabels, Kürzel.
  Fließtext niemals in Mono.
- **Serif genau einmal:** der Insight-Satz. Das ist die Signatur der App und bleibt einmalig.
- **Listen sind Zeilen mit Rand** (`<Rows>`), keine Karten-Grids.
- **Kein `uppercase tracking-widest`** als Sektionslabel — kleines Mono-Label in `ink-faint`.
- **Kontrast:** jede Text-auf-Fläche-Kombination ≥ 4.5:1 in **beiden** Themes. Bei neuen Tokens
  nachrechnen, nicht schätzen.
- **Bewegung nur als Feedback**, 120–160 ms auf Hover/Aktiv; `prefers-reduced-motion` wird global
  in `index.css` respektiert.

Typo-Skala (Tokens in `index.css`): `text-2xs` 11px · `text-xs` 12px · `text-sm` 13px ·
`text-base` 14px (UI-Standard) · `text-prose` 16px (Fließtext) · `text-lg` 18px · `text-xl` 22px ·
`text-2xl` 28px. Prosa-Spalten auf ~70 Zeichen begrenzen (`max-w-[72ch]`).

Layout: Sidebar 260px (Kategorie-Baum, Filter, Fortschritt, Theme-Umschalter) + Inhalt; auf der
Aufgabenseite zusätzlich eine klebrige Meta-Rail (264px) ab `xl`. Unter `lg` wird die Sidebar zur
Schublade. Timer und Reveal-Steuerung aus M2 gehören in die Meta-Rail.

---

## 9. Visualizer-Architektur

Ein Visualizer pro Muster, **18 insgesamt** (Slugs aus `data/patterns.ts`). Das sind die 17 Zeilen des
Muster-Index der Quelle, wobei „DP bottom-up“ in `dp-1d` und `dp-2d` aufgeteilt ist — die
Tabellenfüllung sieht in beiden Fällen zu unterschiedlich aus für einen gemeinsamen Visualizer:

`hashing-complement` · `two-pointer` · `sliding-window` · `monotonic-stack` · `binary-search` ·
`fast-slow-pointer` · `tree-dfs` · `bfs-level-order` · `backtracking` · `union-find` ·
`topological-sort` · `dijkstra-prim` · `heap-topk` · `dp-1d` · `dp-2d` · `greedy-scan` ·
`interval-sweep` · `bit-tricks`

Verbindliches Muster für jeden Visualizer:

1. `steps.ts` exportiert eine **pure Funktion** `buildSteps(input): Step[]`. Sie simuliert den
   Algorithmus komplett vorab und gibt alle Frames zurück. Keine Zufallszahlen, keine Seiteneffekte,
   kein `setTimeout` darin.
2. `Step` enthält immer: `caption` (ein englischer Satz, was in diesem Schritt passiert),
   den vollständigen sichtbaren Zustand und die Hervorhebungen (Indizes/Knoten/Zellen).
   Frames sind vollständig, nicht inkrementell — dadurch ist Zurückspringen trivial.
3. `View.tsx` rendert **einen** Step als SVG. Zustandslos.
4. Gespielt wird über `<StepPlayer>` aus `visualizers/core`: Play/Pause, Schritt vor/zurück,
   Reset, Geschwindigkeit, Fortschrittsleiste, Tastatur (`Space`, `←`, `→`, `r`).
5. `presets.ts` enthält benannte Eingaben — insbesondere je ein Preset pro Aufgabe, die diesen
   Visualizer nutzt. Das ist die „Skizze pro Aufgabe“: `<Viz name="two-pointer" preset="three-sum" />`.
6. `steps.test.ts` prüft mindestens: erster Frame = Ausgangszustand, letzter Frame = korrektes
   Ergebnis, Frame-Anzahl plausibel.

Darstellung: SVG, keine Canvas. Farben aus den Tailwind-Tokens, funktioniert in Light und Dark,
farbenblind-tauglich (nicht nur Rot/Grün unterscheiden — zusätzlich Form/Label).
`prefers-reduced-motion` respektieren: dann keine Auto-Animation, nur Einzelschritte.

---

## 10. Spaced Repetition

Implementierung in `src/lib/srs.ts`, rein funktional und getestet. Basisrhythmus ist der aus der
Lerngrundlage (3 Tage, 2 Wochen):

Nach jedem Versuch bewertet der Nutzer 1–5:

| Rating | Bedeutung | Nächstes Intervall |
|---|---|---|
| 1 | keine Ahnung gehabt | 1 Tag, Streak zurück auf 0 |
| 2 | brauchte die Kernidee | 2 Tage, Streak 0 |
| 3 | mit Hinweisen gelöst | 3 Tage |
| 4 | allein gelöst, langsam | 7 Tage |
| 5 | allein, sauber, schnell | 14 Tage |

Ab dem zweiten Erfolg in Folge (Rating ≥ 3): `interval = round(interval * 2.2)`, gedeckelt bei 90 Tagen.
Fällige Aufgaben landen in `Review`, sortiert nach Überfälligkeit, dann nach Schwierigkeit.

Persistenz: `localStorage`, Key `ncla.progress.v1`, Schema mit `version`-Feld und Migrationspfad.
Zusätzlich gespeichert pro Aufgabe: Status, freigegebene Reveal-Stufe, letzte Zeit, freie Notiz
(„was habe ich übersehen?“). Export/Import als JSON-Datei muss möglich sein — es gibt kein Backend.

---

## 11. Arbeitsweise in diesem Repo

- **Reihenfolge der Quelle beibehalten.** Kategorien 1–18 und die Nummerierung innerhalb der
  Kategorien sind stabile Identifikatoren.
- **Content-Batches:** Aufgaben immer kategorieweise abarbeiten, nie quer. Nach jeder Kategorie
  `npm run validate` laufen lassen und kurz berichten, was fertig ist.
- **Neue Aufgabe anlegen:** Abschnitt in der Lerngrundlage lesen → MDX aus dem Template füllen →
  Muster in `patterns` eintragen → falls sinnvoll ein Visualizer-Preset ergänzen → validieren.
- **Gold-Standard:** `arrays-hashing/03-two-sum.mdx`, `sliding-window/02-longest-substring-without-repeating-characters.mdx`
  und `stack/05-daily-temperatures.mdx` sind die Referenzdateien. Bei Unsicherheit über Tonfall,
  Länge oder Detailtiefe: dort nachsehen und daran ausrichten.
- **Lösungscode muss korrekt sein.** Vor `status: complete` den Python-Code mindestens einmal gegen
  die Beispiele aus dem Statement gedanklich durchspielen; bei nicht-trivialen Aufgaben ein kurzes
  Skript im Scratchpad laufen lassen. Falscher Lösungscode ist der schlimmste mögliche Fehler in
  dieser App — er wird auswendig gelernt.
- Keine Platzhalter-Sektionen („TODO: erklären“) in Dateien mit `status: complete`.
- **Explizite `.ts`-Endungen** in allen Imports unter `scripts/` und in `src/data/*` — diese Module
  werden direkt von Node/tsx geladen und sind Teil des Vite-Config-Graphen, der extensionslose
  Imports künftig nicht mehr auflöst. Der restliche App-Code in `src/` bleibt endungslos.
- Kein Deployment, keine Analytics, keine externen Fonts/CDNs.

### Befehle

```bash
npm run dev
```

```bash
npm run validate
```

`validate` = `tsc --noEmit` + `scripts/validate-content.ts` + `vitest run`.

---

## 12. Git-Workflow — ein Branch pro Slice (verbindlich)

Repo: `https://github.com/TimSchwietzke/ncla.git`, Default-Branch `main`.

- **Nie direkt auf `main` committen.** Jeder Slice bekommt einen eigenen Branch:
  `slice/<kurzname>`, z. B. `slice/m0-scaffold`, `slice/two-pointer-visualizer`,
  `slice/content-arrays-hashing`.
- Ein Slice ist eine abgeschlossene, für sich lauffähige Einheit — ein Meilenstein aus der Roadmap,
  eine Kategorie Content, ein Visualizer. Nicht „halbe Aufgabenseite“.
- Branch anlegen **bevor** die erste Datei des Slices angefasst wird.

### Pflicht am Ende jedes Slices

Bei jedem fertigen Slice liefere ich im Chat **immer** und **unaufgefordert** diese drei Dinge als
fertig verwendbaren Text:

1. **Commit-Message** des Slice-Commits (Subject + Body)
2. **PR-Titel**
3. **PR-Inhalt** (Beschreibungstext des Pull Requests)

Das ist keine Option und wird nicht weggelassen, auch nicht bei kleinen Slices.

### Format

Commits und PRs auf **Englisch** (Sprachregel Abschnitt 1). Commit-Subject im Imperativ, ≤ 72 Zeichen,
kein Punkt am Ende. Body erklärt *warum*, nicht *was* — das steht im Diff.

**Kein `Co-Authored-By`-Trailer.** Commits werden nicht mit Claude als Co-Autor signiert — weder im
Commit noch im PR. Auch nicht als Standardverhalten aus dem Harness übernehmen.

PR-Inhalt hat diese vier Abschnitte:

```
## What        — was der Slice liefert, in Stichpunkten
## Why         — welchen Zweck das im Lernkonzept erfüllt
## How to test — konkrete Schritte, um es selbst zu sehen
## Open        — was bewusst offen bleibt / nächster Slice
```

### Ablauf

1. `git switch -c slice/<name>` (von aktuellem `main`)
2. Arbeiten, `npm run validate` muss grün sein
3. Committen, Branch pushen (`git push -u origin slice/<name>`)
4. Commit-Message, PR-Titel und PR-Inhalt im Chat ausgeben
5. Den PR erst öffnen, wenn Tim es sagt — `gh` ist derzeit nicht authentifiziert

---

## 13. ToDo / Post-MVP (nicht ohne Absprache anfangen)

- **Python im Browser (Pyodide):** Editor pro Aufgabe, Testfälle laufen lokal, sofortiges Feedback.
  Ausdrücklich gewünscht — aber erst nach dem MVP und nur, wenn die Integration schlank bleibt
  (Lazy-Load, kein Bundle-Bloat, App muss ohne Pyodide voll funktionsfähig bleiben).
- **Python-Nachhilfe-Sektion:** eigener Bereich mit den Sprachmitteln, die in Interviews zählen
  (`collections`, `heapq`, Slicing, Comprehensions, `functools.cache`, Rekursionslimit,
  Integer-Division bei negativen Zahlen, String-Immutability).
- Volltextsuche über alle Aufgaben.
- Mock-Interview-Modus: zufällige Aufgabe, Timer, nur Statement, am Ende Selbstbewertung.
- Statistik nach Muster statt nach Kategorie („bei Backtracking bin ich 3× hängengeblieben“).
