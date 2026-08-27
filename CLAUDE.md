# CLAUDE.md — Arbeitsanweisung für ncla

ncla (NeetCodeLearnApp) ist die persönliche Lern-App von Tim zur Vorbereitung auf technische
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

- `reference/neetcode150.json` — **die maschinelle Grundwahrheit.** Für alle 150 Aufgaben:
  Kategorie, Position, `id`, LeetCode-Nummer und -Titel, Schwierigkeit, Premium-Flag, Statement,
  Beispiele, **Constraints**, Follow-up, Topic-Tags, Hints und NeetCodes Referenzlösung.
  Erzeugt von `npm run reference:fetch` aus den Quellen, denen die Daten gehören: die
  NeetCode-150-Liste aus neetcode.io, Nummer/Schwierigkeit/Premium aus LeetCodes Aufgabenindex,
  Aufgabentext und Constraints aus LeetCodes GraphQL, Lösungen aus `neetcode-gh/leetcode`.
  **Nie von Hand bearbeiten** — Ausnahme ist `reference/overrides.json` für die sieben
  Premium-Aufgaben, zu denen LeetCode nichts herausgibt.
- `NeetCode_150_Lerngrundlage.md` — die **didaktische** Quelle: pro Aufgabe *Voraussetzungen ·
  Kernidee · Optimal · Laufzeit · Fallstricke*, dazu Muster-Index, Komplexitäts-Spickzettel und
  Interview-Anhang. Sie war als Grundidee gedacht, nicht als Wahrheit, und wurde gegen die
  Grundwahrheit korrigiert (Kategorie-Reihenfolge, Generate Parentheses, 34 `id`s, 2 Titel).
  **Nicht mehr read-only**, aber jede Änderung an Struktur oder Metadaten muss `npm run
  reference:diff` sauber lassen. Ihre Prosa ist wertvoll und wird nicht umgeschrieben.
- `src/content/**` — der daraus erzeugte, englische, erweiterte App-Content. Übersetzung ist das
  Minimum; jede Aufgabe wird zusätzlich um Statement, Brute Force, Lösungscode und Follow-ups ergänzt.
- **Rangfolge bei Widersprüchen:** `reference/neetcode150.json` schlägt die Lerngrundlage schlägt
  Erinnerung. Statement, Beispiele und Constraints kommen **wörtlich von LeetCode** — NeetCode
  formuliert um und nennt teils andere Schranken, und `<Signals>` rechnet aus der Constraint-Größe
  die erlaubte Komplexität ab. Die Lerngrundlage liefert die Didaktik, nicht die Zahlen.
- **Auch die Referenzlösungen sind nicht unfehlbar.** `npm run reference:smoke` führt sie gegen
  LeetCodes eigene Beispiele aus; zwei Dateien im NeetCode-Repo sind syntaktisch kaputt und stehen
  namentlich in `KNOWN_UPSTREAM_BREAKAGE`. Kopierter Code wird ausgeführt, nicht geglaubt.

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
- **lucide-react** für Icons — tree-shakeable, nur benutzte Icons landen im Bundle, kein
  Laufzeit-Download. Niemals Text oder Sonderzeichen als Icon-Ersatz verwenden.
- **MDX** für Content: `@mdx-js/rollup`, Frontmatter über `remark-frontmatter` +
  `remark-mdx-frontmatter`, Syntax-Highlighting build-time über `@shikijs/rehype` (kein Highlighter
  zur Laufzeit).
- **Vitest** für Tests (SRS-Logik, Visualizer-`buildSteps`, Content-Validierung).
- State: kein Redux/Zustand. Ein kleiner Store in `src/lib/store.ts` (Modul + `useSyncExternalStore`),
  Persistenz in `localStorage`.
- Keine Backend-Komponente, keine Netzwerkaufrufe zur Laufzeit. Die App muss offline funktionieren.
- **Tauri 2** als Desktop-Hülle (`src-tauri/`). Kein zweiter Code-Pfad: dieselbe Vite-App läuft im
  Browser und im Fenster. `npm run dev` bleibt der schnelle Weg, `npm run tauri:dev` zeigt das Fenster.
- **Schriften:** IBM Plex Sans / Mono / Serif, über `@fontsource` aus `node_modules` gebündelt.
  „Keine externen Fonts/CDNs" heißt *kein Netzwerkzugriff zur Laufzeit* — mitgelieferte
  npm-Schriften erfüllen das und sind erwünscht.

Abhängigkeiten sparsam halten. Vor dem Hinzufügen eines Pakets kurz begründen, warum es sich lohnt.

---

## 5. Verzeichnisstruktur

```
ncla/
├── CLAUDE.md · README.md · NeetCode_150_Lerngrundlage.md   # didaktische Quelle
├── reference/
│   ├── neetcode150.json               # Grundwahrheit, generiert — nie von Hand
│   └── overrides.json                 # die 7 Premium-Aufgaben, von neetcode.io
├── index.html · package.json · tsconfig.json · vite.config.ts
├── src-tauri/                         # Desktop-Hülle, nur Konfiguration und ein Rust-Einstieg
│   ├── tauri.conf.json                # Fenster, Identifier, CSP, Bundle-Ziele
│   ├── icon.svg                       # Icon-Quelle → `npx tauri icon src-tauri/icon.svg`
│   ├── Cargo.toml · build.rs · src/   # nichts App-Logisches, nur der Start
├── scripts/
│   ├── lib/                           # frontmatter.ts (+ Test), collect.ts
│   ├── fetch-reference.ts             # baut reference/neetcode150.json
│   ├── diff-source.ts                 # Lerngrundlage gegen die Grundwahrheit
│   ├── smoke-reference.py             # führt alle 150 Referenzlösungen aus
│   ├── build-index.ts                 # erzeugt src/data/generated/index.ts
│   ├── validate-content.ts            # Frontmatter, Pflichtsektionen, Referenzen
│   └── vite-plugin-content-index.ts   # hält den Index im Dev-Server frisch
└── src/
    ├── main.tsx, App.tsx
    ├── routes/                        # eine Datei pro Route, kein Sammelmodul
    │   ├── Landing.tsx                # "/" — Homepage, bewusst OHNE Shell/Sidebar
    │   ├── Dashboard.tsx              # "/dashboard" — Fortschritt, Weiterlernen
    │   ├── Method.tsx                 # "Unbekanntes Problem" — der Leitfaden
    │   ├── Patterns.tsx · PatternDetail.tsx
    │   ├── Categories.tsx · Category.tsx
    │   ├── Problem.tsx                # die Aufgabenseite (Kern der App)
    │   ├── Review.tsx · Progress.tsx · CheatSheet.tsx · NotFound.tsx
    ├── components/                    # nach Rolle gruppiert, nicht flach
    │   ├── shell/                     # AppShell, Sidebar, ThemeToggle
    │   ├── ui/                        # primitives.tsx, DifficultyLabel,
    │   │                              # PatternChip, ProgressMosaic
    │   ├── problem/                   # MetaRail, CodeBlock, Sections
    │   │                              # später: RevealStage, Timer, RatingBar
    │   └── landing/                   # HeroVisualizer, Mockups, Reveal
    ├── visualizers/
    │   ├── core/                      # types.ts, ArrayTrack.tsx, layout.ts (+ Tests)
    │   └── <pattern>/                 # steps.ts (pure), steps.test.ts,
    │                                  # später View.tsx, presets.ts
    ├── content/
    │   ├── problems/<category-slug>/<nn>-<slug>.mdx
    │   ├── patterns/<pattern-slug>.mdx
    │   └── method/*.mdx
    ├── data/
    │   ├── types.ts                   # ProblemMeta, Category, Pattern
    │   ├── categories.ts              # 18 Kategorien, Reihenfolge wie in der Quelle
    │   ├── patterns.ts                # 18 Muster + Erkennungssignal
    │   └── generated/index.ts         # aus dem Frontmatter gebaut, nie von Hand
    ├── lib/                           # content.ts, theme.ts; später srs.ts, storage.ts
    └── styles/                        # tokens.css (Palette), index.css
```

Regeln für neue Dateien:
- **Eine Route = eine Datei** in `routes/`. Kein Sammelmodul für mehrere Seiten.
- **Komponenten nach Rolle**, nicht nach Typ: gehört sie zur App-Hülle → `shell/`, zur
  Aufgabenseite → `problem/`, zur Startseite → `landing/`, ist sie seitenübergreifend und
  präsentational → `ui/`.
- Der Projekt-Root bleibt wie er ist. Die Dateien dort sind von npm, Git, Vite, GitHub und
  Claude Code festgelegt — nichts davon verschieben.

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
<Statement>       Aufgabe in eigenen Worten, dann <Examples> und <Constraints> (Pflicht).
<Signals>         Welche Wörter/Constraints verraten das Muster. 2–4 Stichpunkte.
<BruteForce>      Der naive Ansatz + seine Komplexität + warum er nicht reicht.
<Insight>         Die Kernidee. Genau EIN Satz. Aus der Quelle übersetzt und geschärft.
<Approach>        Der optimale Weg in nummerierten Schritten. Hier <Viz .../> einbetten.
<Solution>        Python. Erst `variant="brute"`, dann `variant="optimal"`.
<Pitfalls>        Die Fallstricke aus der Quelle, englisch, ergänzt.
<FollowUps>       Typische Interview-Rückfragen mit kurzer Antwort.
```

`<Statement>` hat eine feste innere Form — kein Fließtext für Beispiele, keine ```text-Fence:

```mdx
<Examples>
  <Example input={`nums = [2, 7, 11, 15]
target = 9`} output="[0, 1]">
    nums[0] + nums[1] == 9
  </Example>
</Examples>

<Constraints>

- `2 <= n <= 10^4`
- The array is **not** sorted

</Constraints>
```

Beispiele und Constraints sind das, was man zuerst und unter Zeitdruck liest — sie müssen Struktur
haben, nicht Prosa sein. `<Examples>` nummeriert automatisch, die Beschriftungsspalte hat feste
Breite, damit Werte über mehrere Beispiele hinweg fluchten. Der Output bekommt den Akzent, weil man
beim Überfliegen die Antwort sucht. **`scripts/validate-content.ts` verlangt beide Bausteine bei
`status: complete`** — sonst driften 150 Dateien einzeln auseinander.

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

**Was das Interview zeigt, zeigt die App.** Alles, was in der echten Situation vor dir liegt, ist
ohne Klick sichtbar: Aufgabentext, Beispiele, Constraints, Schwierigkeit, LeetCode-Nummer **und die
Zielkomplexität**. Versteckt ist nur, was du selbst finden musst. Deshalb ist *Target complexity*
**keine** Reveal-Stufe, sondern steht dauerhaft in der Meta-Rail.

Umgekehrt gilt: der **Muster-Name ist die halbe Lösung** und steht in keinem Interview — die Chips
in der Rail sind hinter einem `reveal` verborgen (seit M1 umgesetzt).

- **Learn Mode** (Default): sichtbar sind `<Statement>` mit Beispielen und Constraints sowie die
  Zielkomplexität. Danach gibt der Nutzer stufenweise frei — **in Dateireihenfolge**, sechs Stufen:
  `1 <Signals> → 2 <BruteForce> → 3 <Insight> → 4 <Approach> → 5 <Solution> → 6 <Pitfalls> + <FollowUps>`.
  `<BruteForce>` gehört ausdrücklich dazu: den naiven Ansatz selbst zu benennen ist Schritt 4 der
  Methode, ihn gratis zu zeigen überspringt einen Lernschritt.
  Jede Stufe ist ein eigener Klick, die freigegebene Stufe wird pro Aufgabe gespeichert.
  Auf der Seite läuft optional der 20-Minuten-Timer und daneben steht die abhakbare Checkliste aus
  `Method` (Beispiele durchgehen → Constraints → Zielkomplexität → Brute Force → Engpass → Muster).
- **Reference Mode**: alles offen, `<Solution>` eingeklappt. Zum schnellen Wiederholen.

Der Modus darf niemals versehentlich Inhalte spoilern — beim Rendern gilt: was nicht freigegeben ist,
wird gar nicht erst ins DOM gerendert (nicht nur per CSS versteckt). Umgesetzt über `Gate` in
`components/problem/RevealGate.tsx`; die Stufenzuordnung steht ausschließlich in `Sections.tsx`.

**Der Freigabe-Knopf steht inline** unter dem zuletzt freigegebenen Abschnitt und nennt immer, was
als Nächstes käme — dort ist der Blick, wenn man feststeckt, und die Entscheidung fällt bewusst.
Einen „alles zeigen"-Knopf gibt es im Learn Mode **nicht**: der Notausgang ist der Reference Mode.

**Timer** (`lib/timer.ts`): zählt aufwärts, Ziel 20 Minuten, danach wechselt die Anzeige auf
`danger` — kein Ton, kein Dialog. Er liegt in einem Modul-Store und **überlebt Navigation**, weil
Schritt 3 der Methode einen aufs Cheat Sheet schickt. Einen Reload überlebt er nicht; ein so hart
unterbrochener Versuch ist ohnehin vorbei.

**Aller Fortschritt liegt in genau einer Datei**, `ncla.progress.v1` (`lib/progress.ts`) — auch die
abgehakte Checkliste. Niemals einen zweiten `localStorage`-Schlüssel für Aufgabendaten anlegen; das
Schema deklariert bereits die Felder, die M4 füllt.

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
- **Serif ist die Stimme, nicht Dekoration:** der Insight-Satz und die These auf der Startseite.
  Sonst nirgends — sobald Serif in Fließtext oder Labels auftaucht, ist die Signatur weg.
- **Listen sind Zeilen mit Rand** (`<Rows>`), keine Karten-Grids.
- **Kein `uppercase tracking-widest`** als Sektionslabel — kleines Mono-Label in `ink-faint`.
- **Kontrast:** jede Text-auf-Fläche-Kombination ≥ 4.5:1 in **beiden** Themes. Bei neuen Tokens
  nachrechnen, nicht schätzen.
- **Bewegung nur als Feedback**, 120–160 ms auf Hover/Aktiv; `prefers-reduced-motion` wird global
  in `index.css` respektiert.
- **Referenzseiten verstecken nie.** Auf `/method` und `/cheat-sheet` gibt es kein Akkordeon, keine
  Tabs, kein „mehr anzeigen". Wer den Leitfaden aufschlägt, ist blockiert; wer das Cheat Sheet
  öffnet, hat zehn Minuten bis zum Interview. Ein zusätzlicher Klick ist dort echter Schaden.
- **MDX wo Prosa überwiegt, TSX wo Daten überwiegen.** Aufgaben sind Prosa → MDX. Method und Cheat
  Sheet erwiesen sich als datengetrieben (Schritte, Tabellen, Schwellen) → TSX.
- **Die sechs Method-Schritte leben ausschließlich in `src/data/method.ts`.** Die Method-Seite
  rendert sie ausführlich, ab M2 rendert die Meta-Rail dieselben Daten über
  `StepSpine variant="compact"`. Niemals eine zweite Liste anlegen.

Typo-Skala (Tokens in `index.css`): `text-2xs` 11px · `text-xs` 12px · `text-sm` 13px ·
`text-base` 14px (UI-Standard) · `text-prose` 16px (Fließtext) · `text-lg` 18px · `text-xl` 22px ·
`text-2xl` 28px. Prosa-Spalten auf ~70 Zeichen begrenzen (`max-w-[72ch]`).

Routing: `/` ist die Homepage und rendert **außerhalb** der `AppShell` — eine Sidebar daneben würde
den Zweck der Seite zerstören. Alles andere liegt in der Shell, die Arbeitsfläche ist `/dashboard`.

Icons: ausschließlich `lucide-react`, `size={14}`–`{15}` in der Chrome, `strokeWidth={1.75}`.
Kein Text und keine Sonderzeichen als Icon-Ersatz.

Startseite: große Serif-Typografie, animierte SVG-Grafik im Hero, stilisierte App-Fenster pro
Abschnitt (gezeichnet, keine Screenshots), sanfte Scroll-Reveals. Jedes Reveal ist **ausfallsicher** —
wenn der IntersectionObserver nicht meldet, wird der Inhalt trotzdem sichtbar. Eine Dekoration darf
niemals Inhalt verstecken können.

Layout: Sidebar 260px, einklappbar (Ctrl/Cmd+B, Zustand in `ncla.sidebar.collapsed`) — Kategorie-Baum,
Filter, Fortschritt, Theme-Umschalter, Kategorien als aufklappbarer Ordnerbaum (Zustand in
`ncla.sidebar.open`, die aktive Kategorie öffnet sich von selbst) — plus Inhalt; auf der
Aufgabenseite zusätzlich eine klebrige Meta-Rail (264px) ab `xl`. Unter `lg` wird die Sidebar zur
Schublade. Timer und Reveal-Steuerung aus M2 gehören in die Meta-Rail.

---

## 9. Visualizer-Architektur

Ein Visualizer pro Muster, **20 insgesamt** (Slugs aus `data/patterns.ts`). Achtzehn davon sind die
17 Zeilen des Muster-Index der Quelle, wobei „DP bottom-up“ in `dp-1d` und `dp-2d` aufgeteilt ist —
die Tabellenfüllung sieht in beiden Fällen zu unterschiedlich aus für einen gemeinsamen Visualizer:

`hashing-complement` · `two-pointer` · `sliding-window` · `monotonic-stack` · `binary-search` ·
`fast-slow-pointer` · `tree-dfs` · `bfs-level-order` · `backtracking` · `union-find` ·
`topological-sort` · `dijkstra-prim` · `heap-topk` · `dp-1d` · `dp-2d` · `greedy-scan` ·
`interval-sweep` · `bit-tricks`

Die letzten beiden gehen **bewusst über den Index der Quelle hinaus**, weil keine vorhandene Zeile
für sie sachlich passt — die Quelle nennt sie in den Aufgabentexten als Muster und hat vergessen,
sie in die Tabelle zu schreiben:

`prefix-suffix` (Product of Array Except Self; LeetCode taggt die Aufgabe selbst mit „Prefix Sum“) ·
`length-prefix` (Encode and Decode Strings — kein Hashing, kein Zeiger, keine Suche)

Ein weiteres Muster kommt nur dazu, wenn es in mindestens zwei der 150 Aufgaben trägt. „Bucket Sort“
etwa taucht genau einmal auf (Top K Frequent) und bekommt deshalb keins — dort stehen
`hashing-complement` und `heap-topk`, und der Bucket-Trick lebt im `<Insight>`.

Verbindliches Muster für jeden Visualizer:

1. `steps.ts` exportiert **pure Funktionen**, die den Algorithmus vorab komplett simulieren und alle
   Frames zurückgeben. Keine Zufallszahlen, keine Seiteneffekte, kein `setTimeout` darin.
   **Ein Muster darf mehrere Algorithmen abdecken** — Sliding Window umfasst festes *und* variables
   Fenster (`buildFixedWindow`, `buildLongestDistinct`). Dann benannte Varianten exportieren statt
   ein `buildSteps` zu überladen.
2. `Step` enthält immer: `caption` (ein englischer Satz, was in diesem Schritt passiert),
   den vollständigen sichtbaren Zustand und die Hervorhebungen (Indizes/Knoten/Zellen).
   Frames sind vollständig, nicht inkrementell — dadurch ist Zurückspringen trivial.
   **Ein Frame zeigt den Zustand am *Ende* des Schritts.** Wer den aktuellen Index erst nach dem
   Emittieren auf den Stack legt, zeigt eine Struktur, die immer einen Schritt hinterherhinkt.
   `values` sind `(number | string)[]` — eine Zelle trägt ein Zeichen genauso wie eine Zahl.
   `panel` zeigt optional die mitgeführte Struktur (Hash-Map, Stack) neben der Reihe; ohne sie sind
   Hashing und monotoner Stack nicht erklärbar.
3. `View.tsx` rendert **einen** Step als SVG. Zustandslos.
4. Gespielt wird über `<StepPlayer>` aus `visualizers/core`: Play/Pause, Schritt vor/zurück,
   Reset, Geschwindigkeit, Fortschrittsleiste, Tastatur (`Space`, `←`, `→`, `r`).
   **Auf Aufgabenseiten startet er pausiert** — etwas, das von selbst läuft, während man den Ansatz
   liest, zieht die Aufmerksamkeit weg. **Die Tastatur greift nur bei Fokus** (`tabIndex={0}`,
   Handler am Container): ein globaler `Space`-Handler würde das Scrollen der Seite kapern.
5. `presets.ts` enthält benannte Eingaben — insbesondere je ein Preset pro Aufgabe, die diesen
   Visualizer nutzt. Das ist die „Skizze pro Aufgabe“: `<Viz name="two-pointer" preset="three-sum" />`.
   `build` läuft **lazy**, Frames entstehen erst beim Rendern. Eingetragen wird das Muster in
   `visualizers/registry.ts`; fehlt es dort, zeigt `<Viz>` weiterhin die ehrliche Notiz.
   Preset-Eingaben stammen aus den Beispielen der Aufgabe — aber nimm das **lehrreichste**: bei Two
   Sum füllt sich die Map erst bei Beispiel 2 sichtbar, Beispiel 1 ist nach zwei Frames vorbei.
6. `steps.test.ts` prüft mindestens: erster Frame = Ausgangszustand, letzter Frame = korrektes
   Ergebnis, Frame-Anzahl plausibel.

**Stand:** Fünf der zwanzig Muster laufen — `hashing-complement`, `sliding-window`,
`monotonic-stack`, `two-pointer`, `binary-search`. `core/` enthält `types.ts`, den zustandslosen
`ArrayTrack.tsx`, `layout.ts` (kollidierende Marker) und `StepPlayer.tsx`. Eingebunden sind sie über
`registry.ts` in `<Viz>` und auf `PatternDetail`.

Die restlichen fünfzehn kommen **mit ihrem Content**, nicht auf Vorrat. Baum, Graph, Gitter und Heap
brauchen je einen eigenen Renderer neben `ArrayTrack`; der Player und das Preset-System sind schon
darauf ausgelegt, weil `StepPlayer` nur `steps` und eine `render`-Funktion kennt.
**Nicht neu erfinden, was in `core/` schon steht.**

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

**Abweichung von der Lerngrundlage, bewusst:** ab dem zweiten Erfolg in Folge wächst das Intervall
mit einem Faktor, der an der Bewertung hängt — `× 1,6` bei 3, `× 2,2` bei 4, `× 2,8` bei 5,
gedeckelt bei 90 Tagen. Die Quelle nennt pauschal 2,2. Das Prinzip hinter Anki und SuperMemo ist
aber, dass die Sicherheit bestimmt, wie weit etwas wegdarf: eine mühsam mit Hinweisen gelöste
Aufgabe soll sich nicht so schnell entfernen wie eine souveräne. Die 2,2 bleibt der mittlere Fall.
Die drei Faktoren stehen als `GROWTH_FACTOR` in `lib/srs.ts` und sind mit echten Daten justierbar —
das ist kein Implementierungsfehler, sondern eine getroffene Entscheidung.

Ab `intervalDays >= 21` gilt eine Aufgabe als **gefestigt** (`MATURE_AFTER_DAYS`); das ist die
übliche Grenze und färbt das Mosaik auf der Fortschrittsseite.

Fällige Aufgaben landen in `Review`, sortiert nach Überfälligkeit, **bei Gleichstand die schwierigere
zuerst** — die Quelle legt keine Richtung fest, hier ist sie festgelegt: mit frischem Kopf gehört das
Harte nach vorn. Darunter „neu" in Quellreihenfolge, darunter „shaky" (zuletzt 1 oder 2, noch nicht
fällig) eingeklappt, bis oben nichts mehr steht.

Persistenz: `localStorage`, Key `ncla.progress.v1`, Schema mit `version`-Feld und Migrationspfad.
Zusätzlich gespeichert pro Aufgabe: Status, freigegebene Reveal-Stufe, letzte Zeit, freie Notiz
(„was habe ich übersehen?“). Export/Import als JSON-Datei muss möglich sein — es gibt kein Backend. `lib/backup.ts` verzweigt an
`"__TAURI_INTERNALS__" in window`: im Fenster echter Speichern-Dialog über `plugin-dialog` und
`plugin-fs`, im Browser Blob-Download und `<input type="file">`. Ein Knopf, der still nichts tut,
wäre schlimmer als keiner.

Dateiformat mit Hülle, damit fremdes JSON nicht als Fortschritt durchgeht:
`{ "app": "ncla", "exportedAt": …, "progress": { version, problems } }`.
**Der Import ersetzt und fragt vorher** — er zeigt, was in der Datei steht und was gerade da ist.
Wochen an Historie stillschweigend zu überschreiben wäre der schlimmste Fehler dieser Seite.

---

## 11. Arbeitsweise in diesem Repo

- **Reihenfolge der geprüften Liste beibehalten.** Kategorien 1–18 und die Nummerierung innerhalb
  der Kategorien kommen aus `reference/neetcode150.json` und sind stabile Identifikatoren. Nicht aus
  der Lerngrundlage abschreiben — die lag bei Kategorie-Reihenfolge und 34 `id`s daneben.
  `npm run reference:diff` muss nach jeder Änderung sauber durchlaufen.
- **Content-Batches:** Aufgaben immer kategorieweise abarbeiten, nie quer. Nach jeder Kategorie
  `npm run validate` laufen lassen und kurz berichten, was fertig ist.
- **Neue Aufgabe anlegen:** Eintrag in `reference/neetcode150.json` lesen (Statement, Beispiele,
  Constraints, Referenzlösung) **und** den Abschnitt in der Lerngrundlage (Kernidee, Fallstricke) →
  MDX aus dem Template füllen →
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
npm run tauri:dev
```

```bash
npm run validate
```

```bash
npm run reference:diff
```

`validate` = `tsc --noEmit` + `scripts/validate-content.ts` + `vitest run`.
`tauri:build` erzeugt Installer unter `src-tauri/target/release/bundle/`.

Die drei Referenz-Befehle laufen nicht bei jedem Slice, sondern wenn an Roster, Kategorien oder
Metadaten etwas hängt:

- `reference:fetch` — holt alles neu und schreibt `reference/neetcode150.json`. Dauert ein paar
  Minuten (150 Netzabrufe) und braucht Internet. Nur nötig, wenn NeetCode seine Liste ändert.
- `reference:diff` — Lerngrundlage gegen die Grundwahrheit. **Muss sauber sein**, sonst driften
  Quelle und App auseinander.
- `reference:smoke` — führt alle 150 Referenzlösungen gegen LeetCodes eigene Beispiele aus.
  Braucht Python. Erwartung: 105 verifiziert, 43 nicht abdeckbar (Design-, Baum- und
  In-place-Aufgaben), 2 upstream kaputt, 0 falsch.

### Tauri-Regeln

- **Keine App-Logik in Rust.** `src-tauri/src/` startet nur das Fenster. Alles Fachliche bleibt im
  Frontend, damit die App im Browser vollständig benutzbar bleibt.
- **Routing:** `src/main.tsx` wählt zur Laufzeit — `HashRouter` im Fenster, `BrowserRouter` im
  Browser. Im Bundle gibt es kein Server-Routing, ein Reload auf `/dashboard` liefe sonst ins Leere.
- **localStorage ist origin-gebunden.** Browser und Fenster teilen sich den Speicher **nicht**.
  Das ist der Grund, warum die Hülle vor M4 kam: sonst wäre der Lernfortschritt beim Umstieg weg.
  Wer zwischen beiden wechseln will, nutzt den JSON-Export.
- **`cargo` liegt nicht im PATH der Shell.** Es steckt in `%USERPROFILE%\.cargo\bin`.
  `npm run tauri:build` scheitert sonst mit „failed to run 'cargo metadata' … program not found".
  In PowerShell davor: `$env:PATH = "$env:USERPROFILE\.cargo\bin;$env:PATH"`.
- **CSP** steht in `tauri.conf.json` und erlaubt ausschließlich lokale Quellen. Wer eine externe
  Ressource einbauen will, hat die Offline-Regel schon gebrochen — nicht die CSP aufweichen.

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

**Vor** dem PR-Text läuft `npm run tauri:build` — und zwar bei **jedem** Slice, nicht nur bei
solchen, die `src-tauri/` anfassen. `npm run validate` prüft die Rust-Seite nicht: eine kaputte
CSP, eine fehlende Berechtigung oder ein Plugin, das im Release-Profil anders baut, fällt erst hier
auf. Das Fenster ist die Umgebung, in der wirklich gelernt wird; ein grüner Vitest-Lauf sagt darüber
nichts. Bricht der Build, wird er repariert, bevor der PR-Text kommt.

Danach liefere ich im Chat **immer** und **unaufgefordert** diese drei Dinge als fertig
verwendbaren Text:

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
3. `npm run tauri:build` — muss durchlaufen, auch wenn der Slice nur Frontend anfasst
4. Committen, Branch pushen (`git push -u origin slice/<name>`)
5. Commit-Message, PR-Titel und PR-Inhalt im Chat ausgeben
6. Den PR erst öffnen, wenn Tim es sagt — `gh` ist derzeit nicht authentifiziert

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
