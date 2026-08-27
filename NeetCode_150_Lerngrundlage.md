# NeetCode 150 — Lerngrundlage für technische Interviews

> Vollständige Liste in Original-Reihenfolge und -Kategorisierung. Pro Problem:
> **Voraussetzungen** (was du vorher können musst) · **Kernidee** (der eine Gedanke, der das Problem knackt) · **Optimaler Ansatz** (Muster, konkrete Lösung, Laufzeit/Speicher, Fallstricke).

---

## Wie du diese Datei benutzt

**Nicht von oben nach unten durchlesen.** Die Datei ist ein Nachschlagewerk, kein Buch.

Empfohlener Ablauf pro Problem:
1. Aufgabe auf LeetCode/NeetCode öffnen, **20 Minuten Timer**, selbst versuchen.
2. Bei Blockade: nur die Zeile **Kernidee** lesen — nicht mehr. Weiter versuchen.
3. Erst danach **Optimaler Ansatz** lesen und selbst implementieren (nicht abtippen).
4. Nach 3 Tagen und nach 2 Wochen: nur die **Kernidee** aus dem Kopf rekonstruieren können. Wenn das gelingt, sitzt das Muster.

**Realistische Dosierung:** 3–4 Probleme pro Tag über ~7 Wochen. Lieber 2 Probleme wirklich verstanden als 8 abgehakt. Wenn ein Tag ausfällt, ist das kein Grund, den Plan zu kippen — einfach weitermachen.

**Reihenfolge:** Die Kategorien 1–5 (Arrays bis Binary Search) sind die Basis, danach beliebig. Advanced Graphs und 2-D DP zuletzt.

---

## Muster-Index (das eigentliche Lernziel)

Interviews prüfen nicht 150 Lösungen, sondern ~19 Muster. Wenn du eine Aufgabe siehst, ist die erste Frage: *welches Muster?*

Die letzten beiden Zeilen fehlten in der ersten Fassung dieser Tabelle, obwohl die Aufgabentexte sie als
Muster benennen. Beide sind ergänzt, weil keine der übrigen Zeilen für sie sachlich passt.

| Muster | Erkennungssignal | Kategorien |
|---|---|---|
| Hashing / Komplement | "Gibt es …?", Zählen, Gruppieren | Arrays & Hashing |
| Two Pointer | **sortiertes** Array, Paare, Palindrom | Two Pointers |
| Sliding Window | "längster/kürzester Teilstring mit Bedingung" | Sliding Window |
| Monotone Stack/Deque | "nächstes größeres/kleineres Element" | Stack, Sliding Window |
| Binary Search on Answer | monotone Ja/Nein-Frage über Zahlenbereich | Binary Search |
| Fast/Slow Pointer | Zyklus, Mitte einer Liste | Linked List |
| DFS-Rekursion mit Rückgabewert | Baum, "berechne für jeden Knoten" | Trees |
| BFS (Level-Order) | kürzester Weg, ungewichtet, "gleichzeitig" | Trees, Graphs |
| Backtracking | "alle Kombinationen/Permutationen" | Backtracking |
| Union-Find | Zusammenhangskomponenten, Zyklus (ungerichtet) | Graphs |
| Topologische Sortierung | Abhängigkeiten, gerichteter Zyklus | Graphs |
| Dijkstra / Prim (Heap) | gewichtete Kanten, minimale Kosten | Advanced Graphs |
| Top-K / Median (Heap) | "k größte", laufender Median | Heap |
| DP bottom-up | überlappende Teilprobleme, optimale Substruktur | 1-D / 2-D DP |
| Greedy + Beweis | lokale Wahl, "reicht ein Durchlauf?" | Greedy |
| Sortieren nach Startzeit | Intervalle | Intervals |
| XOR / Bit-Tricks | Zahlen, Duplikate, ohne Zusatzspeicher | Bit Manipulation |
| Präfix / Suffix | Antwort an i braucht alles links **und** alles rechts davon | Arrays & Hashing |
| Length-Prefix-Encoding | jedes Trennzeichen kann selbst in den Daten stehen | Arrays & Hashing |

---

## Komplexitäts-Spickzettel

| Struktur | Zugriff | Suche | Einfügen | Löschen |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Dynamisches Array (push) | O(1) | O(n) | O(1) amortisiert | O(n) |
| Hash-Map / Set | — | O(1) ⌀ | O(1) ⌀ | O(1) ⌀ |
| Verkettete Liste | O(n) | O(n) | O(1) bei Referenz | O(1) bei Referenz |
| Binärer Suchbaum (balanciert) | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | O(1) Min/Max | O(n) | O(log n) | O(log n) |
| Trie | — | O(L) | O(L) | O(L) |
| Union-Find (Pfadkompression + Rank) | — | ~O(α(n)) ≈ O(1) | — | — |

**Faustregel für die erlaubte Komplexität aus den Constraints:**
n ≤ 10 → O(n!) / O(2ⁿ) · n ≤ 20 → O(2ⁿ) · n ≤ 500 → O(n³) · n ≤ 5.000 → O(n²) · n ≤ 10⁶ → O(n log n) · n ≤ 10⁸ → O(n)

---
## 1. Arrays & Hashing (9)

### 1.1 Contains Duplicate — LC 217 · Easy
- **Voraussetzungen:** Hash-Set, Begriff "amortisiert O(1)".
- **Kernidee:** Ein Set merkt sich alles Gesehene; das erste Element, das schon drin ist, ist die Antwort.
- **Optimal:** Muster **Hashing**. Einmal durchlaufen, `if x in seen: return True`, sonst `seen.add(x)`. Alternative ohne Zusatzspeicher: sortieren und Nachbarn vergleichen → O(n log n) Zeit, O(1) Speicher. Im Interview beide nennen und den Trade-off begründen.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Keine. Diese Aufgabe ist der Aufwärmer — nutze sie, um sauber laut zu denken.

### 1.2 Valid Anagram — LC 242 · Easy
- **Voraussetzungen:** Hash-Map als Zähler (`Counter`), ASCII-Werte.
- **Kernidee:** Zwei Strings sind Anagramme ⟺ ihre Buchstaben-Häufigkeiten sind identisch.
- **Optimal:** Muster **Counting**. Ein Array `int[26]` (bei nur Kleinbuchstaben): erster String `+1`, zweiter `-1`, am Ende muss alles 0 sein. Ein einziger Durchlauf über beide Strings gleichzeitig.
- **Laufzeit:** O(n) · **Speicher:** O(1) (26 fest)
- **Fallstricke:** Längen vorher vergleichen (Early Exit). Follow-up "was bei Unicode?" → Hash-Map statt Array, Speicher O(k).

### 1.3 Two Sum — LC 1 · Easy
- **Voraussetzungen:** Hash-Map `Wert → Index`.
- **Kernidee:** Nicht nach Paaren suchen, sondern für jedes `x` nach dem **Komplement** `target - x` fragen — das ist ein O(1)-Lookup statt einer Schleife.
- **Optimal:** Muster **Hashing / Komplement**. Ein Durchlauf: erst prüfen, ob `target - x` in der Map ist (→ Ergebnis), *dann* `x` einfügen. Diese Reihenfolge verhindert automatisch, dasselbe Element doppelt zu benutzen.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Array ist **nicht** sortiert → Two Pointer geht hier nicht ohne Sortieren (und Sortieren zerstört die Indizes).

### 1.4 Group Anagrams — LC 49 · Medium
- **Voraussetzungen:** Hash-Map mit zusammengesetztem Schlüssel, Tupel als Key (unveränderlich!).
- **Kernidee:** Alle Anagramme brauchen eine **kanonische Form** als gemeinsamen Schlüssel.
- **Optimal:** Muster **Hashing mit Signatur**. Schlüssel = Tupel der 26 Buchstabenzähler → O(n·k). Einfacher, aber leicht langsamer: sortierter String als Schlüssel → O(n·k log k). Nenne den Zähl-Ansatz, er ist der bessere.
- **Laufzeit:** O(n·k) (n Wörter, k Länge) · **Speicher:** O(n·k)
- **Fallstricke:** In Python muss der Key hashbar sein → `tuple(counts)`, nicht `list`.

### 1.5 Top K Frequent Elements — LC 347 · Medium
- **Voraussetzungen:** Counter, Heap **oder** Bucket Sort.
- **Kernidee:** Die Häufigkeit eines Elements liegt garantiert zwischen 1 und n — also kann man sie als **Array-Index** benutzen statt zu sortieren.
- **Optimal:** Muster **Bucket Sort**. `buckets[freq]` = Liste der Elemente mit dieser Häufigkeit, dann von hinten (höchste Frequenz) einsammeln bis k voll ist → **O(n)**. Heap-Variante (`heapq.nlargest`) ist O(n log k) und im Interview als Erstlösung völlig okay, aber die O(n)-Lösung ist der Punktgewinn.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Sortieren nach Frequenz (O(n log n)) ist die naive Lösung — erkennen und übertreffen.

### 1.6 Encode and Decode Strings — LC 271 · Medium (Premium)
- **Voraussetzungen:** String-Parsing, Bewusstsein für Delimiter-Kollisionen.
- **Kernidee:** Jedes Trennzeichen kann selbst im String vorkommen — also **Länge voranstellen** statt trennen.
- **Optimal:** Muster **Length-Prefix-Encoding**. Encode: `f"{len(s)}#{s}"` pro String. Decode: ab Pointer i bis zum nächsten `#` lesen → Länge L, dann exakt L Zeichen ab `#+1` nehmen, Pointer weitersetzen.
- **Laufzeit:** O(n) beide Richtungen · **Speicher:** O(n)
- **Fallstricke:** Das `#` im Inhalt stört **nicht**, weil die Länge bestimmt, wie weit gelesen wird — genau das musst du im Interview aussprechen.

### 1.7 Product of Array Except Self — LC 238 · Medium
- **Voraussetzungen:** Präfix-/Suffix-Produkte, Verbot der Division beachten.
- **Kernidee:** Das Ergebnis für Index i ist (Produkt aller links von i) × (Produkt aller rechts von i).
- **Optimal:** Muster **Prefix/Suffix**. Erster Durchlauf von links: `res[i] = Produkt links`. Zweiter von rechts: laufende Variable `suffix`, `res[i] *= suffix`. Das Ausgabe-Array zählt laut Aufgabe nicht als Zusatzspeicher.
- **Laufzeit:** O(n) · **Speicher:** O(1) (ohne Output)
- **Fallstricke:** Division ist verboten (und bricht bei Nullen). Nullen im Array sind der klassische Testfall.

### 1.8 Valid Sudoku — LC 36 · Medium
- **Voraussetzungen:** Sets, Index-Arithmetik für 3×3-Boxen.
- **Kernidee:** Drei unabhängige Duplikat-Prüfungen (Zeile, Spalte, Box) lassen sich in **einem** Durchlauf erledigen.
- **Optimal:** Muster **Hashing**. Drei Set-Arrays: `rows[9]`, `cols[9]`, `boxes[9]`. Box-Index = `(r // 3) * 3 + c // 3`. Bei jeder Ziffer alle drei Sets prüfen und befüllen.
- **Laufzeit:** O(81) = O(1) · **Speicher:** O(1)
- **Fallstricke:** Nur die *aktuelle* Belegung prüfen — Lösbarkeit ist nicht gefragt. `'.'` überspringen.

### 1.9 Longest Consecutive Sequence — LC 128 · Medium
- **Voraussetzungen:** Hash-Set, Amortisationsargument.
- **Kernidee:** Nur an **Sequenzanfängen** hochzählen. `x` ist ein Anfang ⟺ `x-1` ist nicht im Set.
- **Optimal:** Muster **Hashing**. Alles in ein Set. Für jedes x mit `x-1 ∉ set`: solange `x+1, x+2, …` im Set sind, hochzählen. Jede Zahl wird dadurch insgesamt höchstens zweimal angefasst → linear trotz innerer Schleife.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Sortieren wäre O(n log n) und laut Aufgabe nicht erlaubt. Duplikate erledigt das Set von allein. Leeres Array abfangen.

---

## 2. Two Pointers (5)

### 2.1 Valid Palindrome — LC 125 · Easy
- **Voraussetzungen:** Zeichenklassifikation (`isalnum`), In-Place-Zeiger.
- **Kernidee:** Von beiden Enden nach innen laufen und nur alphanumerische Zeichen vergleichen — kein bereinigter Hilfsstring nötig.
- **Optimal:** Muster **Two Pointer (konvergierend)**. `l=0, r=n-1`; nicht-alphanumerische Zeichen überspringen; `lower()`-Vergleich; bei Ungleichheit `False`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Die Skip-Schleifen brauchen `while l < r`, sonst Index-Overflow. Ein gefilterter String wäre O(n) Speicher — der Interviewer will O(1).

### 2.2 Two Sum II - Input Array Is Sorted — LC 167 · Medium
- **Voraussetzungen:** Warum Sortierung Two Pointer erlaubt.
- **Kernidee:** Bei sortiertem Array ist die Summe der Randzeiger **monoton** steuerbar: zu klein → links nach rechts, zu groß → rechts nach links.
- **Optimal:** Muster **Two Pointer (konvergierend)**. Genau ein Durchlauf, kein Hash-Set nötig → O(1) Speicher, das ist der Unterschied zu Two Sum I.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Rückgabe ist **1-indiziert**.

### 2.3 3Sum — LC 15 · Medium
- **Voraussetzungen:** Two Sum II, Sortieren, Duplikat-Handling.
- **Kernidee:** Ein Element fixieren, dann ist der Rest ein Two-Sum-II-Problem auf dem Suffix.
- **Optimal:** Muster **Sortieren + Two Pointer**. Sortieren; für jedes i (mit `nums[i] == nums[i-1]` → skip) zwei Zeiger über `i+1 … n-1` auf Ziel `-nums[i]`. Nach einem Treffer beide Zeiger über Duplikate hinwegschieben. Early Exit: `nums[i] > 0` → fertig.
- **Laufzeit:** O(n²) · **Speicher:** O(1) (ohne Output/Sortierpuffer)
- **Fallstricke:** **Duplikate sind hier das ganze Problem.** Ein Set über die Ergebnisse zu legen funktioniert, ist aber die schwächere Antwort — zeige das Skipping.

### 2.4 Container With Most Water — LC 11 · Medium
- **Voraussetzungen:** Fläche = Breite × min(Höhe), Greedy-Argument.
- **Kernidee:** Die **kürzere** Wand ist der Flaschenhals. Sie zu behalten kann nie helfen, weil die Breite nur schrumpft — also darf man sie verwerfen.
- **Optimal:** Muster **Two Pointer + Greedy-Beweis**. `l=0, r=n-1`, Fläche berechnen, den Zeiger mit der kleineren Höhe nach innen schieben, Maximum mitführen.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Der Beweis, *warum* man die kleinere Seite bewegt, ist die eigentliche Interviewfrage. Übe die Begründung in einem Satz.

### 2.5 Trapping Rain Water — LC 42 · Hard
- **Voraussetzungen:** Two Pointer, Präfix-Maxima; alternativ monotoner Stack.
- **Kernidee:** Wasser über Position i = `min(maxLinks, maxRechts) - height[i]`. Man braucht diese Maxima aber nie beide exakt — nur das kleinere.
- **Optimal:** Muster **Two Pointer**. `l, r` an den Rändern, `leftMax, rightMax` mitführen. Ist `leftMax < rightMax`, ist links der Flaschenhals: `l` vorrücken, Wasser `leftMax - height[l]` addieren; sonst symmetrisch rechts. O(1) Speicher statt zweier Präfix-Arrays.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Der Einstieg über zwei Präfix-Max-Arrays (O(n) Speicher) ist erlaubt und sinnvoll als Zwischenschritt — dann laut auf O(1) optimieren.

---

## 3. Sliding Window (6)

### 3.1 Best Time to Buy and Sell Stock — LC 121 · Easy
- **Voraussetzungen:** Laufendes Minimum.
- **Kernidee:** Beim Durchlaufen nur das bisher **günstigste Kaufdatum** merken und an jedem Tag den hypothetischen Gewinn prüfen.
- **Optimal:** Muster **Sliding Window / laufendes Minimum**. `minPrice = min(minPrice, p)`, `maxProfit = max(maxProfit, p - minPrice)`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Nur *eine* Transaktion. Bei monoton fallenden Preisen ist die Antwort 0, nicht negativ.

### 3.2 Longest Substring Without Repeating Characters — LC 3 · Medium
- **Voraussetzungen:** Hash-Set/Map, Fenster mit variabler Größe.
- **Kernidee:** Fenster rechts ausdehnen; sobald ein Duplikat auftaucht, links so weit nachziehen, bis das Fenster wieder gültig ist.
- **Optimal:** Muster **Sliding Window (variabel)**. Set-Variante: `while s[r] in window: window.remove(s[l]); l += 1`. Schnellere Variante: Map `Zeichen → letzter Index`, dann `l = max(l, lastIndex + 1)` — Sprung statt Schleife.
- **Laufzeit:** O(n) · **Speicher:** O(min(n, Alphabet))
- **Fallstricke:** Bei der Map-Variante ist `max(l, …)` zwingend, sonst springt `l` zurück.

### 3.3 Longest Repeating Character Replacement — LC 424 · Medium
- **Voraussetzungen:** Gültigkeitsbedingung eines Fensters formulieren können.
- **Kernidee:** Ein Fenster ist gültig ⟺ `Fensterlänge - Häufigkeit des häufigsten Zeichens ≤ k` (so viele müssen ersetzt werden).
- **Optimal:** Muster **Sliding Window + Zählarray**. `count[26]` mitführen, `maxFreq` **nie verkleinern** (der Trick: ein kleineres maxFreq könnte das Ergebnis nie vergrößern) → das Fenster schrumpft höchstens, wächst aber nie fälschlich.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Das nicht-zurückgesetzte `maxFreq` wirkt falsch, ist aber korrekt — die Begründung solltest du parat haben.

### 3.4 Permutation in String — LC 567 · Medium
- **Voraussetzungen:** Anagramm-Zählung, Fenster **fester** Größe.
- **Kernidee:** Eine Permutation von s1 in s2 ist ein Teilstring der Länge |s1| mit identischem Häufigkeitsvektor.
- **Optimal:** Muster **Sliding Window (fest) + Counting**. Fenster der Länge |s1| über s2 schieben, beim Verschieben nur ein Zeichen rein und eins raus. Statt 26 Werte pro Schritt zu vergleichen: Zähler `matches` (0…26) inkrementell pflegen → O(1) pro Schritt.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** `len(s1) > len(s2)` sofort `False`.

### 3.5 Minimum Window Substring — LC 76 · Hard
- **Voraussetzungen:** Sliding Window mit Bedingung, Counter-Arithmetik.
- **Kernidee:** Rechts ausdehnen bis gültig, dann links **so weit wie möglich** schrumpfen und dabei das Minimum protokollieren. Expand–Contract.
- **Optimal:** Muster **Sliding Window (variabel)**. `need` = Counter(t), `have` = Anzahl erfüllter Zeichen. `r` vor: wenn `window[c] == need[c]` → `have += 1`. Solange `have == len(need)`: Ergebnis aktualisieren, `l` vor, bei Unterschreiten `have -= 1`.
- **Laufzeit:** O(|s| + |t|) · **Speicher:** O(|t|)
- **Fallstricke:** Duplikate in t. Ergebnis über (Start, Länge) speichern, nicht den String kopieren. Kein Fenster gefunden → `""`.

### 3.6 Sliding Window Maximum — LC 239 · Hard
- **Voraussetzungen:** Deque, Begriff "monoton".
- **Kernidee:** Ein Element, das kleiner ist als ein **später** eintreffendes, kann nie wieder Maximum werden → sofort wegwerfen.
- **Optimal:** Muster **Monotone Deque (absteigend)**, Indizes speichern. Pro Schritt: hinten alle kleineren Werte poppen, neuen Index anhängen; vorne den Index poppen, falls er aus dem Fenster gefallen ist; `deque[0]` ist das Maximum. Jeder Index geht genau einmal rein und raus → amortisiert O(1).
- **Laufzeit:** O(n) · **Speicher:** O(k)
- **Fallstricke:** **Indizes** speichern, nicht Werte, sonst kann man das Herausfallen nicht erkennen. Heap-Lösung ist O(n log n) — als Zwischenschritt nennen, dann verbessern.

---

## 4. Stack (6)

### 4.1 Valid Parentheses — LC 20 · Easy
- **Voraussetzungen:** Stack, Map schließend → öffnend.
- **Kernidee:** Klammern sind LIFO — die zuletzt geöffnete muss zuerst geschlossen werden.
- **Optimal:** Muster **Stack**. Öffnende pushen; bei schließender prüfen, ob der Stack nicht leer ist und das Top-Element passt, sonst `False`. Am Ende muss der Stack leer sein.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Leerer Stack bei schließender Klammer (`")("`). Nicht-leerer Stack am Ende (`"(("`).

### 4.2 Min Stack — LC 155 · Medium
- **Voraussetzungen:** Stack-API, Invarianten-Denken.
- **Kernidee:** Das Minimum zum Zeitpunkt jedes Pushs mitspeichern — dann ist es beim Pop automatisch wiederhergestellt.
- **Optimal:** Muster **Augmentierter Stack**. Zweiter Stack, der bei jedem Push `min(val, minStack[-1])` ablegt und synchron poppt. Alternative: Tupel `(val, curMin)` in einem Stack.
- **Laufzeit:** O(1) für alle Operationen · **Speicher:** O(n)
- **Fallstricke:** Beim `pop()` beide Stacks poppen. Follow-up "O(1) Extra-Speicher?" → Delta-Kodierung `2*val - min`, nur erwähnen wenn gefragt.

### 4.3 Evaluate Reverse Polish Notation — LC 150 · Medium
- **Voraussetzungen:** Postfix-Notation, Integer-Division Richtung Null.
- **Kernidee:** Operator → zwei Operanden poppen, Ergebnis pushen.
- **Optimal:** Muster **Stack**. Reihenfolge beachten: `b = pop()`, `a = pop()`, dann `a op b`.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Division muss **Richtung Null** trunkieren; Python `//` rundet ab → `int(a / b)` benutzen. Negative Zahlen sind gültige Tokens, also nicht auf `isdigit()` prüfen.

### 4.4 Daily Temperatures — LC 739 · Medium
- **Voraussetzungen:** Monotoner Stack, "Next Greater Element".
- **Kernidee:** Ein Tag wartet auf den ersten wärmeren Tag — beim Auftauchen eines wärmeren Werts löst man **alle** wartenden auf einmal auf.
- **Optimal:** Muster **Monotoner Stack (absteigend, Indizes)**. Für jedes i: solange `t[i] > t[stack[-1]]` → poppen, `res[idx] = i - idx`. Dann i pushen. Jeder Index maximal einmal rein/raus.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Indizes speichern, nicht Temperaturen. Übrige Stack-Einträge bleiben 0.

### 4.5 Car Fleet — LC 853 · Medium
- **Voraussetzungen:** Sortieren, Stack, Zeit = Distanz/Geschwindigkeit.
- **Kernidee:** Von hinten denken: Ein Auto bildet nur dann eine neue Flotte, wenn seine Ankunftszeit **größer** ist als die des Autos vor ihm — sonst holt es auf und wird geschluckt.
- **Optimal:** Muster **Sortieren + Monotoner Stack**. Nach Position absteigend sortieren, `time = (target - pos) / speed`. Von vorne (= dichtestes Auto zuerst) durchgehen: ist `time > stack[-1]`, pushen (neue Flotte). Antwort = Stack-Größe. Ein Stack ist nicht zwingend, eine `maxTime`-Variable reicht → O(1).
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** Float-Division statt Integer. Autos an gleicher Position kommen laut Constraints nicht vor.

### 4.6 Largest Rectangle in Histogram — LC 84 · Hard
- **Voraussetzungen:** Monotoner Stack, Konzept "linke/rechte Grenze".
- **Kernidee:** Für jeden Balken das maximale Rechteck bestimmen, in dem **er** der kleinste ist. Die Grenzen sind das jeweils nächste kleinere Element links und rechts.
- **Optimal:** Muster **Monotoner Stack (aufsteigend)**. Stack aus `(startIndex, height)`. Ist der neue Balken kleiner, so lange poppen, Fläche `height * (i - startIndex)` berechnen und den Startindex des zuletzt gepoppten übernehmen. Am Ende Reststack mit `n - start` abrechnen.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Der übernommene Startindex ist die Stelle, an der die meisten scheitern. Sentinel-Balken der Höhe 0 am Ende spart die Nachbereitung. Direkter Vorläufer von **Maximal Rectangle** (LC 85).

---

## 5. Binary Search (7)

### 5.1 Binary Search — LC 704 · Easy
- **Voraussetzungen:** Sortiertes Array, Overflow-sichere Mitte.
- **Kernidee:** Halbierung des Suchraums bei jeder Entscheidung.
- **Optimal:** Muster **Binäre Suche**. `while l <= r`, `m = l + (r - l) // 2`, drei Fälle. Schreibe **eine** Template-Variante und benutze sie immer gleich.
- **Laufzeit:** O(log n) · **Speicher:** O(1)
- **Fallstricke:** `<=` vs `<` und ob `m ± 1` — das ist der Grund für 90 % aller Binary-Search-Bugs. In Java/C++ `(l+r)/2` vermeiden (Overflow).

### 5.2 Search a 2D Matrix — LC 74 · Medium
- **Voraussetzungen:** Index-Umrechnung 1D ↔ 2D.
- **Kernidee:** Die Matrix ist zeilenweise sortiert *und* Zeilenübergänge sind sortiert → sie ist ein flaches sortiertes Array.
- **Optimal:** Muster **Binäre Suche auf virtuellem Array**. Suchraum `0 … m*n-1`, Umrechnung `row = mid // n`, `col = mid % n`. Alternative: erst Zeile per Binärsuche, dann Spalte → O(log m + log n), gleiche Klasse.
- **Laufzeit:** O(log(m·n)) · **Speicher:** O(1)
- **Fallstricke:** Nicht mit LC 240 (Search a 2D Matrix II) verwechseln — dort gilt die globale Sortierung **nicht**, dort läuft man von der oberen rechten Ecke.

### 5.3 Koko Eating Bananas — LC 875 · Medium
- **Voraussetzungen:** "Binary Search on Answer", Monotonie erkennen.
- **Kernidee:** Nicht im Array suchen, sondern im **Antwortbereich** 1…max(piles). Die Frage "schafft sie es mit Tempo k?" ist monoton (wahr bleibt wahr für größere k).
- **Optimal:** Muster **Binary Search on Answer**. Prädikat `hours(k) = Σ ceil(pile / k) ≤ h`. Kleinstes gültiges k suchen (Lower-Bound-Template).
- **Laufzeit:** O(n log(max(piles))) · **Speicher:** O(1)
- **Fallstricke:** Das Erkennen, dass hier überhaupt binär gesucht wird, ist die Aufgabe. `ceil` ohne Floats: `(pile + k - 1) // k`. Gleiches Muster: LC 1011, 410.

### 5.4 Find Minimum in Rotated Sorted Array — LC 153 · Medium
- **Voraussetzungen:** Eigenschaften rotierter sortierter Arrays.
- **Kernidee:** Vergleiche `nums[m]` mit `nums[r]`: ist `nums[m] > nums[r]`, liegt der Bruchpunkt rechts, sonst links (inklusive m).
- **Optimal:** Muster **Modifizierte Binäre Suche**. `while l < r`; `if nums[m] > nums[r]: l = m + 1 else: r = m`. Rückgabe `nums[l]`.
- **Laufzeit:** O(log n) · **Speicher:** O(1)
- **Fallstricke:** Vergleich mit `nums[r]`, **nicht** mit `nums[l]` — mit `nums[l]` braucht man einen Sonderfall für unrotierte Arrays. Duplikate (LC 154) machen es zum Worst-Case O(n).

### 5.5 Search in Rotated Sorted Array — LC 33 · Medium
- **Voraussetzungen:** LC 153.
- **Kernidee:** Bei jeder Halbierung ist **mindestens eine** Hälfte garantiert sortiert — dort kann man per Bereichsvergleich entscheiden.
- **Optimal:** Muster **Modifizierte Binäre Suche**. Ist `nums[l] <= nums[m]`, ist links sortiert: liegt target in `[nums[l], nums[m])` → rechts kappen, sonst links. Sonst symmetrisch für die rechte Hälfte.
- **Laufzeit:** O(log n) · **Speicher:** O(1)
- **Fallstricke:** Die Grenzen (`<` vs `<=`) im Bereichstest. Alternative: erst Pivot per LC 153 finden, dann normale Binärsuche im richtigen Teil — leichter fehlerfrei zu schreiben.

### 5.6 Time Based Key-Value Store — LC 981 · Medium
- **Voraussetzungen:** Hash-Map + Binärsuche, Upper-Bound-Semantik.
- **Kernidee:** Timestamps kommen **aufsteigend** rein → pro Key ist die Liste automatisch sortiert, also binär durchsuchbar.
- **Optimal:** Muster **Hash-Map von sortierten Listen**. `map[key] = [(ts, val), …]`; `get` sucht den größten `ts ≤ target` (rechteste gültige Position merken, wenn `ts <= target`, dann `l = m + 1`).
- **Laufzeit:** `set` O(1), `get` O(log n) · **Speicher:** O(n)
- **Fallstricke:** Kein Timestamp klein genug → `""`. Nicht neu sortieren, die Eingabereihenfolge ist garantiert.

### 5.7 Median of Two Sorted Arrays — LC 4 · Hard
- **Voraussetzungen:** Binärsuche über eine Partition, saubere Randbehandlung.
- **Kernidee:** Nicht mergen, sondern eine **Trennlinie** durch beide Arrays suchen, sodass links insgesamt (m+n+1)/2 Elemente liegen und `maxLinks ≤ minRechts` gilt.
- **Optimal:** Muster **Partition Binary Search** über das **kürzere** Array. `i` in A binär suchen, `j = (m+n+1)//2 - i`. Prüfen: `A[i-1] <= B[j]` und `B[j-1] <= A[i]`. Passt es, ist der Median aus den vier Randwerten ablesbar (gerade/ungerade unterscheiden).
- **Laufzeit:** O(log(min(m, n))) · **Speicher:** O(1)
- **Fallstricke:** Ränder mit `-∞`/`+∞` abfangen. Immer über das kürzere Array suchen, sonst wird j negativ. Diese Aufgabe ist die schwerste der Kategorie — Merge in O(m+n) als Fallback bereithalten und ansagen.

---

## 6. Linked List (11)

### 6.1 Reverse Linked List — LC 206 · Easy
- **Voraussetzungen:** Zeigerarithmetik, Rekursion.
- **Kernidee:** Drei Zeiger (`prev`, `cur`, `next`) und pro Schritt genau eine Kante umdrehen.
- **Optimal:** Muster **Iterative Zeigermanipulation**. `nxt = cur.next; cur.next = prev; prev = cur; cur = nxt`. Rückgabe `prev`. Rekursiv möglich, aber O(n) Stack.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** `next` **vor** dem Umbiegen sichern. Diese Aufgabe ist Bausteinwissen für 6.3 und 6.11 — sie muss blind sitzen.

### 6.2 Merge Two Sorted Lists — LC 21 · Easy
- **Voraussetzungen:** Dummy-Node-Technik.
- **Kernidee:** Wie der Merge-Schritt von Mergesort, nur mit Zeigern statt Kopien.
- **Optimal:** Muster **Two Pointer + Dummy Head**. Dummy anlegen, `tail` mitführen, jeweils den kleineren Kopf anhängen; am Ende den Rest anhängen. Rückgabe `dummy.next`.
- **Laufzeit:** O(n + m) · **Speicher:** O(1)
- **Fallstricke:** Ohne Dummy braucht man einen Sonderfall für den Listenkopf — der Dummy ist genau dafür da.

### 6.3 Linked List Cycle — LC 141 · Easy
- **Voraussetzungen:** Floyd's Cycle Detection.
- **Kernidee:** Zwei Läufer unterschiedlicher Geschwindigkeit treffen sich genau dann, wenn es einen Kreis gibt.
- **Optimal:** Muster **Fast/Slow Pointer**. `slow` 1 Schritt, `fast` 2 Schritte; Treffen → Zyklus, `fast is None` → kein Zyklus.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Set-Lösung ist O(n) Speicher — funktioniert, aber der Interviewer fragt nach O(1). `fast.next` auf None prüfen.

### 6.4 Reorder List — LC 143 · Medium
- **Voraussetzungen:** 6.1, 6.2, Mitte finden.
- **Kernidee:** Zerlegen in drei bekannte Teilprobleme: Mitte finden → zweite Hälfte umdrehen → abwechselnd verweben.
- **Optimal:** Muster **Fast/Slow + Reverse + Merge**. `slow/fast` für die Mitte, `slow.next = None` zum Trennen, zweite Hälfte reversen, dann alternierend verketten.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Die Verbindung zur zweiten Hälfte kappen, sonst Zyklus. Ungerade Länge: die erste Hälfte darf einen Knoten mehr haben.

### 6.5 Remove Nth Node From End of List — LC 19 · Medium
- **Voraussetzungen:** Two Pointer mit festem Abstand, Dummy-Node.
- **Kernidee:** Ein Zeiger startet n Schritte früher — wenn der vordere am Ende ist, steht der hintere genau vor dem Ziel.
- **Optimal:** Muster **Two Pointer (versetzt)**. `left = dummy`, `right` n Schritte vor. Beide bis `right is None`. `left.next = left.next.next`.
- **Laufzeit:** O(n), ein Durchlauf · **Speicher:** O(1)
- **Fallstricke:** Löschen des **Kopfes** → Dummy-Node löst das. Off-by-One beim Vorlauf.

### 6.6 Copy List with Random Pointer — LC 138 · Medium
- **Voraussetzungen:** Hash-Map als Original→Kopie-Mapping.
- **Kernidee:** Random-Zeiger können auf noch nicht existierende Knoten zeigen → in **zwei Durchläufen** arbeiten: erst alle Knoten klonen, dann die Zeiger verdrahten.
- **Optimal:** Muster **Hashing (zwei Durchläufe)**. Pass 1: `map[old] = Node(old.val)`. Pass 2: `map[old].next = map[old.next]`, `map[old].random = map[old.random]` (mit `map[None] = None`).
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Follow-up O(1) Speicher: Kopien **verschachtelt** in die Originalliste einhängen (A→A'→B→B'), Randoms setzen, dann entflechten. Kennen, aber erst auf Nachfrage.

### 6.7 Add Two Numbers — LC 2 · Medium
- **Voraussetzungen:** Übertrag, Dummy-Node.
- **Kernidee:** Ziffern liegen bereits in umgekehrter Reihenfolge → schriftliche Addition von links nach rechts.
- **Optimal:** Muster **Simulation + Dummy Head**. Schleife solange `l1 or l2 or carry`; `total = v1 + v2 + carry`; neuer Knoten `total % 10`; `carry = total // 10`.
- **Laufzeit:** O(max(n, m)) · **Speicher:** O(max(n, m))
- **Fallstricke:** Der **letzte Übertrag** (999 + 1) — deshalb `carry` in der Schleifenbedingung. Nie die Listen in Integer umwandeln (Overflow-Argument).

### 6.8 Find the Duplicate Number — LC 287 · Medium
- **Voraussetzungen:** 6.7, Umdeutung Array → Funktionsgraph.
- **Kernidee:** `i → nums[i]` ist eine verkettete Liste; das Duplikat ist genau der **Zykluseingang**, weil zwei Indizes darauf zeigen.
- **Optimal:** Muster **Floyd's Algorithmus, Phase 2**. Treffpunkt finden, dann einen Zeiger auf 0 zurücksetzen und beide **einzeln** laufen lassen — der neue Treffpunkt ist der Zykluseingang.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Array darf nicht verändert und kein Zusatzspeicher benutzt werden — das schließt Sortieren und Set aus. Werte liegen in `[1, n]`, deshalb funktioniert die Indexabbildung.

### 6.9 LRU Cache — LC 146 · Medium
- **Voraussetzungen:** Doppelt verkettete Liste + Hash-Map, Design-Aufgabe.
- **Kernidee:** Hash-Map liefert O(1)-Zugriff, die doppelt verkettete Liste liefert O(1)-Umhängen der Reihenfolge. Keine Struktur allein kann beides.
- **Optimal:** Muster **Hash-Map + DLL**. Zwei Sentinel-Knoten (`left` = LRU-Ende, `right` = MRU-Ende). `get`: Knoten aushängen und rechts wieder einhängen. `put`: bei Überlauf den Knoten hinter `left` entfernen und aus der Map löschen.
- **Laufzeit:** O(1) für `get` und `put` · **Speicher:** O(capacity)
- **Fallstricke:** Beim Evict **beide** Strukturen aufräumen. Sentinels sparen alle Null-Checks. (Python-`OrderedDict` erwähnen, aber die manuelle Lösung zeigen.)

### 6.10 Merge k Sorted Lists — LC 23 · Hard
- **Voraussetzungen:** 6.2, Heap oder Divide & Conquer.
- **Kernidee:** Listen paarweise mergen statt eine nach der anderen — dann durchläuft jedes Element nur log k Merges statt k.
- **Optimal:** Muster **Divide and Conquer**. In Runden je zwei Listen mergen, bis eine übrig ist. Alternative mit gleicher Komplexität: Min-Heap mit den k Köpfen.
- **Laufzeit:** O(N log k) (N = Gesamtzahl Knoten) · **Speicher:** O(1) bei D&C, O(k) beim Heap
- **Fallstricke:** Naives Nacheinander-Mergen ist O(N·k). Beim Heap braucht Python einen Tiebreaker (`(val, idx, node)`), weil Nodes nicht vergleichbar sind.

### 6.11 Reverse Nodes in k-Group — LC 25 · Hard
- **Voraussetzungen:** 6.1, sehr sauberes Zeiger-Buchhalten.
- **Kernidee:** Blockweise reversen und die Nahtstellen (`groupPrev`, `groupNext`) korrekt wieder verknüpfen.
- **Optimal:** Muster **Iteratives Reverse mit Dummy**. Pro Gruppe: k-ten Knoten suchen (fehlt er → fertig, Rest bleibt), Block reversen bis `groupNext`, dann `groupPrev.next` umhängen und `groupPrev` auf das alte Blockende setzen.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Der Rest-Block mit weniger als k Knoten bleibt **unverändert**. Diese Aufgabe lebt von Sorgfalt — auf Papier mit 5 Knoten und k=2 durchzeichnen.

---

## 7. Trees (15)

### 7.1 Invert Binary Tree — LC 226 · Easy
- **Voraussetzungen:** Baumrekursion.
- **Kernidee:** Kinder tauschen und rekursiv absteigen.
- **Optimal:** Muster **DFS**. `root.left, root.right = invert(root.right), invert(root.left)`. Iterativ per Queue/Stack ebenso möglich.
- **Laufzeit:** O(n) · **Speicher:** O(h) Rekursionstiefe
- **Fallstricke:** `None`-Basisfall. (Berühmt geworden durch den Homebrew-Tweet — kommt tatsächlich vor.)

### 7.2 Maximum Depth of Binary Tree — LC 104 · Easy
- **Voraussetzungen:** DFS-Rekursion mit Rückgabewert.
- **Kernidee:** Tiefe = 1 + Maximum der Kindertiefen.
- **Optimal:** Muster **DFS (post-order)**. `return 1 + max(depth(l), depth(r))`, `None → 0`. BFS-Variante zählt Level und läuft mit O(Breite) Speicher.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** Keine — nutze sie, um das Post-Order-Schema zu verinnerlichen, das die halbe Kategorie trägt.

### 7.3 Diameter of Binary Tree — LC 543 · Easy
- **Voraussetzungen:** 7.2, Trennung von "Rückgabewert" und "globalem Ergebnis".
- **Kernidee:** Der längste Pfad geht durch **irgendeinen** Knoten. Pro Knoten: Kandidat `linkeHöhe + rechteHöhe`; nach oben zurückgegeben wird aber nur `1 + max(...)`.
- **Optimal:** Muster **DFS mit Seiteneffekt**. Globales `res` mitführen, die Funktion gibt die Höhe zurück.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** Höhe ≠ Durchmesser — das saubere Trennen dieser beiden Größen ist das Lernziel und wiederholt sich in 7.11 und 7.14.

### 7.4 Balanced Binary Tree — LC 110 · Easy
- **Voraussetzungen:** 7.2, Early Exit in Rekursion.
- **Kernidee:** In einem Durchlauf Höhe **und** Balanciertheit zurückgeben, statt für jeden Knoten die Höhe neu zu berechnen.
- **Optimal:** Muster **DFS (post-order) mit Tupel-Rückgabe** `(balanced, height)`. Oder `-1` als Sentinel für "unbalanciert" nach oben durchreichen.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** Der naive Ansatz (pro Knoten Höhe neu berechnen) ist O(n²) — genau darauf zielt die Aufgabe.

### 7.5 Same Tree — LC 100 · Easy
- **Voraussetzungen:** Parallele Rekursion über zwei Bäume.
- **Kernidee:** Gleich ⟺ Wurzeln gleich **und** beide Teilbäume paarweise gleich.
- **Optimal:** Muster **DFS**. Basisfälle: beide `None` → True; genau einer `None` oder Werte verschieden → False.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** Der Fall "genau einer ist None" muss vor dem Wertvergleich stehen.

### 7.6 Subtree of Another Tree — LC 572 · Easy
- **Voraussetzungen:** 7.5.
- **Kernidee:** An jedem Knoten von `root` prüfen, ob dort ein zu `subRoot` identischer Baum hängt.
- **Optimal:** Muster **DFS im DFS**. `isSubtree(r) = isSame(r, sub) or isSubtree(r.left) or isSubtree(r.right)`. O(n·m) — für die Constraints ausreichend. Fortgeschritten: Serialisierung beider Bäume + KMP → O(n + m).
- **Laufzeit:** O(n·m) · **Speicher:** O(h)
- **Fallstricke:** Leerer `subRoot` ist per Definition ein Teilbaum. Bei Serialisierung Null-Marker setzen, sonst falsche Treffer.

### 7.7 Lowest Common Ancestor of a Binary Search Tree — LC 235 · Medium
- **Voraussetzungen:** BST-Eigenschaft.
- **Kernidee:** Der erste Knoten, bei dem sich p und q auf **verschiedene** Seiten aufteilen (oder auf den einer der beiden fällt), ist der LCA.
- **Optimal:** Muster **BST-Navigation**. Sind beide kleiner → links; beide größer → rechts; sonst aktueller Knoten. Iterativ ohne Rekursion.
- **Laufzeit:** O(h) · **Speicher:** O(1)
- **Fallstricke:** Nicht mit LC 236 (allgemeiner Binärbaum) verwechseln — dort braucht man echtes Post-Order-DFS.

### 7.8 Binary Tree Level Order Traversal — LC 102 · Medium
- **Voraussetzungen:** BFS mit Queue, Level-Grenzen.
- **Kernidee:** Vor jedem Level die aktuelle Queue-Länge festhalten — das sind genau die Knoten dieser Ebene.
- **Optimal:** Muster **BFS (Level-Order)**. Äußere Schleife über Level, innere `for _ in range(len(queue))`.
- **Laufzeit:** O(n) · **Speicher:** O(Breite)
- **Fallstricke:** `len(queue)` **vor** der inneren Schleife sichern, nicht darin auswerten. Basis für 7.9, 7.15.

### 7.9 Binary Tree Right Side View — LC 199 · Medium
- **Voraussetzungen:** 7.8.
- **Kernidee:** Sichtbar ist pro Ebene genau der letzte Knoten.
- **Optimal:** Muster **BFS**, pro Level das letzte Element speichern. DFS-Alternative: rechts zuerst besuchen und beim ersten Knoten je Tiefe speichern (`if depth == len(res)`).
- **Laufzeit:** O(n) · **Speicher:** O(Breite)
- **Fallstricke:** Nicht "immer nach rechts laufen" — ein linker Teilbaum kann tiefer reichen.

### 7.10 Count Good Nodes in Binary Tree — LC 1448 · Medium
- **Voraussetzungen:** DFS mit weitergereichtem Zustand.
- **Kernidee:** Das Maximum auf dem Pfad von der Wurzel als Parameter nach unten reichen.
- **Optimal:** Muster **DFS (pre-order) mit Parameter**. `dfs(node, maxSoFar)`; zählt `node.val >= maxSoFar`, ruft Kinder mit `max(maxSoFar, node.val)` auf.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** `>=`, nicht `>` — gleich große Werte zählen. Wurzel zählt immer.

### 7.11 Validate Binary Search Tree — LC 98 · Medium
- **Voraussetzungen:** BST-Definition (global, nicht lokal!).
- **Kernidee:** Jeder Knoten hat ein erlaubtes **Intervall**, das beim Absteigen enger wird — die Prüfung nur gegen die direkten Kinder ist falsch.
- **Optimal:** Muster **DFS mit Grenzen**. `valid(node, low, high)`; links `(low, node.val)`, rechts `(node.val, high)`, Start `(-∞, +∞)`. Alternative: In-Order-Traversal muss streng aufsteigend sein.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** **Der Klassiker-Fehler:** nur Eltern-Kind vergleichen. Grenzen sind strikt (`<`, nicht `<=`).

### 7.12 Kth Smallest Element in a BST — LC 230 · Medium
- **Voraussetzungen:** In-Order-Traversal, iterativer Stack.
- **Kernidee:** In-Order liefert die Werte sortiert → das k-te ausgegebene Element ist die Antwort.
- **Optimal:** Muster **Iteratives In-Order mit Stack**, Abbruch nach k Elementen (kein vollständiger Durchlauf).
- **Laufzeit:** O(h + k) · **Speicher:** O(h)
- **Fallstricke:** k ist 1-indiziert. Follow-up "häufige Änderungen?" → Knoten um Teilbaumgrößen erweitern → O(h) pro Anfrage.

### 7.13 Construct Binary Tree from Preorder and Inorder Traversal — LC 105 · Medium
- **Voraussetzungen:** Traversal-Reihenfolgen, Index-Map.
- **Kernidee:** Das erste Preorder-Element ist die Wurzel; ihre Position im Inorder-Array trennt linken von rechtem Teilbaum und liefert damit die Größen.
- **Optimal:** Muster **Divide and Conquer**. Hash-Map `Wert → Inorder-Index` vorberechnen und mit Index-Bereichen statt Slicing arbeiten → O(n).
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Naives Slicing + `index()` ist O(n²). Die Größe des linken Teilbaums korrekt in den Preorder-Bereich übersetzen. Werte sind laut Constraints eindeutig.

### 7.14 Binary Tree Maximum Path Sum — LC 124 · Hard
- **Voraussetzungen:** 7.3 (Trennung Rückgabewert/globales Ergebnis).
- **Kernidee:** Pro Knoten zwei verschiedene Größen: der **Beitrag nach oben** (nur ein Ast erlaubt) und der **Kandidat** (beide Äste + Knoten, dieser Pfad kann nicht weiter nach oben).
- **Optimal:** Muster **DFS (post-order) mit globalem Maximum**. `left = max(dfs(l), 0)`, `right = max(dfs(r), 0)` (negative Äste abschneiden); `res = max(res, node.val + left + right)`; `return node.val + max(left, right)`.
- **Laufzeit:** O(n) · **Speicher:** O(h)
- **Fallstricke:** Negative Werte — das `max(…, 0)` ist essenziell. `res` mit `-∞` initialisieren, nicht mit 0 (Baum kann komplett negativ sein).

### 7.15 Serialize and Deserialize Binary Tree — LC 297 · Hard
- **Voraussetzungen:** Traversal + Parsing, Null-Marker.
- **Kernidee:** Mit expliziten Null-Markern wird **ein** Traversal eindeutig umkehrbar — ohne sie braucht man zwei.
- **Optimal:** Muster **Pre-Order DFS mit Sentinels**. Serialize: Werte und `"N"` kommagetrennt. Deserialize: Liste mit laufendem Index; `"N"` → `None`, sonst Knoten bauen und rekursiv links, dann rechts.
- **Laufzeit:** O(n) beide Richtungen · **Speicher:** O(n)
- **Fallstricke:** Der Index muss über die Rekursion hinweg geteilt werden (Closure/Instanzvariable). BFS-Serialisierung ist gleichwertig, aber fehleranfälliger im Parsing.

---

## 8. Heap / Priority Queue (7)

### 8.1 Kth Largest Element in a Stream — LC 703 · Easy
- **Voraussetzungen:** Min-Heap, Grundidee "Heap der Größe k".
- **Kernidee:** Ein **Min**-Heap der festen Größe k hält an der Spitze genau das k-größte Element.
- **Optimal:** Muster **Top-K mit Min-Heap**. `add`: pushen, dann bei `len > k` poppen; Rückgabe `heap[0]`.
- **Laufzeit:** O(log k) pro `add` · **Speicher:** O(k)
- **Fallstricke:** Min-Heap für "k größte" wirkt verkehrt herum — das ist der Kern des Musters und muss erklärbar sein.

### 8.2 Last Stone Weight — LC 1046 · Easy
- **Voraussetzungen:** Max-Heap (in Python: Werte negieren).
- **Kernidee:** Reine Simulation — man braucht immer nur die zwei größten Steine.
- **Optimal:** Muster **Max-Heap**. Solange >1 Stein: zwei poppen, Differenz bei ≠ 0 zurückpushen.
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** Python hat nur Min-Heaps → alles negiert speichern. Leerer Heap am Ende → 0.

### 8.3 K Closest Points to Origin — LC 973 · Medium
- **Voraussetzungen:** 9.1, quadrierte Distanz.
- **Kernidee:** Für den Vergleich reicht `x² + y²` — die Wurzel ist monoton und damit überflüssig.
- **Optimal:** Muster **Top-K mit Max-Heap der Größe k** → O(n log k). Für sehr große n: **Quickselect** → O(n) im Mittel. Beide nennen.
- **Laufzeit:** O(n log k) · **Speicher:** O(k)
- **Fallstricke:** Vollständiges Sortieren (O(n log n)) ist die naive Lösung. `sqrt` weglassen — auch aus Präzisionsgründen.

### 8.4 Kth Largest Element in an Array — LC 215 · Medium
- **Voraussetzungen:** Heap, Quickselect (Lomuto/Hoare-Partition).
- **Kernidee:** Man muss nicht sortieren, sondern nur **eine** Position korrekt platzieren — Quickselect verwirft nach jeder Partition eine Hälfte komplett.
- **Optimal:** Muster **Quickselect**. Partitionieren; liegt der Pivot-Index auf `n - k`, ist man fertig, sonst nur in der relevanten Seite weitersuchen. Zufälliges Pivot gegen den O(n²)-Worst-Case.
- **Laufzeit:** O(n) im Mittel, O(n²) worst case · **Speicher:** O(1)
- **Fallstricke:** Heap-Lösung O(n log k) ist die sichere Antwort; Quickselect ist die, die beeindruckt. Indexumrechnung k-größtes = `n - k` im aufsteigend sortierten Array.

### 8.5 Task Scheduler — LC 621 · Medium
- **Voraussetzungen:** Greedy, Counting; Heap **oder** Formel.
- **Kernidee:** Die **häufigste** Aufgabe bestimmt das Gerüst: sie erzeugt `maxFreq - 1` Blöcke der Länge `n + 1`, alle anderen füllen die Lücken.
- **Optimal:** Muster **Greedy-Formel**. `res = max(len(tasks), (maxFreq - 1) * (n + 1) + Anzahl der Tasks mit maxFreq)`. Heap-Simulation (Max-Heap + Queue mit Freigabezeit) ist die intuitive Alternative.
- **Laufzeit:** O(n) mit Formel, O(n log 26) mit Heap · **Speicher:** O(1)
- **Fallstricke:** `max(len(tasks), …)` ist zwingend — bei vielen verschiedenen Aufgaben gibt es keine Leerlaufzeiten.

### 8.6 Design Twitter — LC 355 · Medium
- **Voraussetzungen:** Hash-Maps, Heap-Merge (verwandt mit LC 23).
- **Kernidee:** Tweets pro User als zeitgeordnete Liste speichern; der Feed ist ein **Merge der k neuesten** aus den gefolgten Listen.
- **Optimal:** Muster **Hash-Map + Max-Heap**. Globaler absteigender Zeitzähler. `getNewsFeed`: von jedem gefolgten User den letzten Tweet in den Heap, beim Poppen den jeweils nächsten desselben Users nachschieben, bis 10 erreicht sind.
- **Laufzeit:** O(f log f + 10 log f) pro Feed · **Speicher:** O(Tweets + Follows)
- **Fallstricke:** Man folgt sich selbst implizit. `unfollow` eines Nicht-Gefolgten darf nicht crashen. Nicht alle Tweets sortieren.

### 8.7 Find Median from Data Stream — LC 295 · Hard
- **Voraussetzungen:** Zwei Heaps, Balance-Invariante.
- **Kernidee:** Die Daten in zwei Hälften teilen: **Max**-Heap für die kleinere Hälfte, **Min**-Heap für die größere. Der Median steht dann direkt an den Spitzen.
- **Optimal:** Muster **Two Heaps**. Immer erst in den Max-Heap pushen, dessen Top in den Min-Heap verschieben, dann bei Ungleichgewicht (>1) zurückbalancieren. Median = Top der größeren Hälfte bzw. Mittelwert der beiden Tops.
- **Laufzeit:** `addNum` O(log n), `findMedian` O(1) · **Speicher:** O(n)
- **Fallstricke:** Die Balance-Regel muss **jedes Mal** laufen. Konsequent eine feste Konvention wählen (z. B. Max-Heap darf einen mehr haben), sonst wird der ungerade Fall inkonsistent.

---

## 9. Backtracking (10)

### 9.1 Subsets — LC 78 · Medium
- **Voraussetzungen:** Rekursionsbaum, Entscheidungsdenken.
- **Kernidee:** Pro Element genau zwei Entscheidungen: **nehmen oder nicht nehmen** → 2ⁿ Blätter.
- **Optimal:** Muster **Backtracking (Include/Exclude)**. `dfs(i)`: bei `i == n` Kopie speichern; sonst Element anhängen → `dfs(i+1)` → wieder entfernen → `dfs(i+1)`.
- **Laufzeit:** O(n · 2ⁿ) · **Speicher:** O(n) Rekursion
- **Fallstricke:** Beim Speichern **Kopie** anlegen (`path[:]`), sonst landen Referenzen im Ergebnis. Bitmask-Alternative kennen.

### 9.2 Combination Sum — LC 39 · Medium
- **Voraussetzungen:** 10.1, Wiederverwendung von Elementen.
- **Kernidee:** Ein Kandidat darf mehrfach benutzt werden → beim Rekursieren **denselben** Index behalten; um Duplikate zu vermeiden, nie zurückgehen.
- **Optimal:** Muster **Backtracking mit Startindex**. `dfs(i, path, rest)`: Abbruch bei `rest == 0` (speichern) oder `rest < 0 or i == n`. Zweig 1: `dfs(i, …, rest - c[i])`, Zweig 2: `dfs(i+1, …, rest)`.
- **Laufzeit:** O(2^(target/min)) · **Speicher:** O(target/min)
- **Fallstricke:** Ohne Startindex entstehen Permutationen statt Kombinationen. Sortieren erlaubt frühes Abschneiden.

### 9.3 Combination Sum II — LC 40 · Medium
- **Voraussetzungen:** 10.2 + 10.4 kombiniert.
- **Kernidee:** Jedes Element nur einmal verwendbar (`i + 1`) **und** Duplikat-Skipping pro Ebene.
- **Optimal:** Muster **Backtracking + Sortieren**. Sortieren, Schleife ab `start`, `if i > start and c[i] == c[i-1]: continue`, Rekursion mit `i + 1`. `break`, sobald `c[i] > rest`.
- **Laufzeit:** O(2ⁿ) · **Speicher:** O(n)
- **Fallstricke:** Beide Mechanismen sind nötig — mit nur einem entstehen Duplikate oder fehlende Lösungen.

### 9.4 Permutations — LC 46 · Medium
- **Voraussetzungen:** Rekursion mit "verbrauchten" Elementen.
- **Kernidee:** An jeder Position jedes noch unbenutzte Element ausprobieren.
- **Optimal:** Muster **Backtracking mit used-Array**. Alternativ in-place: Position i mit jedem j ≥ i tauschen, rekursieren, zurücktauschen → O(1) Zusatzspeicher.
- **Laufzeit:** O(n · n!) · **Speicher:** O(n)
- **Fallstricke:** Das Zurücktauschen/Zurücksetzen nicht vergessen — das ist das "Backtracking" im Namen.

### 9.5 Subsets II — LC 90 · Medium
- **Voraussetzungen:** 10.1, Duplikat-Skipping.
- **Kernidee:** Duplikate erzeugen identische Teilmengen → sortieren und auf **derselben Rekursionsebene** gleiche Werte nur einmal starten lassen.
- **Optimal:** Muster **Backtracking + Sortieren**. In der Schleife: `if i > start and nums[i] == nums[i-1]: continue`.
- **Laufzeit:** O(n · 2ⁿ) · **Speicher:** O(n)
- **Fallstricke:** `i > start` (nicht `i > 0`) — das erlaubt Duplikate *innerhalb* einer Teilmenge, verbietet aber doppelte Zweige. Sortieren ist Voraussetzung.

### 9.6 Generate Parentheses — LC 22 · Medium
- **Voraussetzungen:** Rekursion/Backtracking, Gültigkeits-Invariante.
- **Kernidee:** Beim Aufbauen nur gültige Präfixe zulassen: `open < n` erlaubt eine öffnende, `close < open` erlaubt eine schließende.
- **Optimal:** Muster **Backtracking**. Rekursion mit `(open, close)`; bei `len == 2n` Ergebnis speichern. (NeetCode führte diese Aufgabe früher unter Stack — der Aufrufstack ist hier aber nur das Mittel, das Muster ist das Aufbauen und Verwerfen gültiger Präfixe.)
- **Laufzeit:** O(4ⁿ / √n) (Catalan-Zahl) · **Speicher:** O(n) Rekursionstiefe
- **Fallstricke:** Nicht alle 2^(2n) Strings erzeugen und filtern — die Invariante schneidet den Baum vorab.

### 9.7 Word Search — LC 79 · Medium
- **Voraussetzungen:** Grid-DFS, Besuchsmarkierung.
- **Kernidee:** Von jeder Zelle aus DFS in vier Richtungen; die aktuelle Zelle während des Abstiegs sperren und danach freigeben.
- **Optimal:** Muster **Backtracking auf Grid**. In-place markieren (z. B. `#` schreiben und danach zurückschreiben) → O(L) statt O(m·n) Zusatzspeicher. Bei falschem Zeichen oder Randüberschreitung sofort `False`.
- **Laufzeit:** O(m·n·4^L) · **Speicher:** O(L)
- **Fallstricke:** Das Zurücksetzen der Markierung nach der Rekursion. Optimierung: startet das Wort mit dem selteneren Zeichen, ggf. das Wort umdrehen.

### 9.8 Palindrome Partitioning — LC 131 · Medium
- **Voraussetzungen:** Backtracking, Palindromtest.
- **Kernidee:** An jeder Position jeden möglichen Präfix-Schnitt testen; ist der Präfix ein Palindrom, rekursiv den Rest partitionieren.
- **Optimal:** Muster **Backtracking**. `dfs(i)`: für `j` von `i` bis `n-1`, wenn `s[i..j]` Palindrom → anhängen, `dfs(j+1)`, entfernen. Optional DP-Tabelle `isPal[i][j]` vorberechnen → O(1) Test.
- **Laufzeit:** O(n · 2ⁿ) · **Speicher:** O(n)
- **Fallstricke:** Einzelzeichen sind Palindrome. Ohne vorberechnete Tabelle kostet jeder Test O(n) — akzeptabel, aber erwähnenswert.

### 9.9 Letter Combinations of a Phone Number — LC 17 · Medium
- **Voraussetzungen:** Mapping Ziffer → Buchstaben, kartesisches Produkt.
- **Kernidee:** Klassisches kartesisches Produkt über die Ziffernpositionen.
- **Optimal:** Muster **Backtracking**. `dfs(i, path)`; bei `i == len(digits)` speichern. Iterative BFS-Variante (Ergebnisliste schrittweise erweitern) ist gleichwertig.
- **Laufzeit:** O(4ⁿ · n) · **Speicher:** O(n)
- **Fallstricke:** Leerer Input → leere Liste (**nicht** `[""]`). 7 und 9 haben vier Buchstaben.

### 9.10 N-Queens — LC 51 · Hard
- **Voraussetzungen:** Backtracking, Diagonal-Indexierung.
- **Kernidee:** Zeile für Zeile eine Dame setzen; Konflikte über drei Sets in O(1) prüfen statt das Brett zu scannen.
- **Optimal:** Muster **Backtracking mit Konflikt-Sets**. `cols`, `diag` (`r - c`), `antiDiag` (`r + c`). Pro Zeile alle Spalten testen, Sets setzen/zurücksetzen.
- **Laufzeit:** ~O(n!) · **Speicher:** O(n)
- **Fallstricke:** Die Diagonalformeln (`r-c` konstant auf ↘, `r+c` auf ↙) auswendig können. `r - c` kann negativ sein — Set statt Array, oder Offset `+n`.

---

## 10. Tries (3)

### 10.1 Implement Trie (Prefix Tree) — LC 208 · Medium
- **Voraussetzungen:** Baumknoten mit Kindern-Map, Endmarkierung.
- **Kernidee:** Gemeinsame Präfixe teilen sich Knoten — Suche kostet dann nur die Wortlänge, unabhängig von der Anzahl der Wörter.
- **Optimal:** Muster **Trie**. Knoten = `{children: dict, isEnd: bool}`. `insert` legt fehlende Kinder an und setzt am Ende `isEnd`. `search` verlangt `isEnd`, `startsWith` nicht.
- **Laufzeit:** O(L) pro Operation · **Speicher:** O(Σ Wortlängen)
- **Fallstricke:** `search("app")` darf nicht True liefern, nur weil `"apple"` existiert — genau dafür ist `isEnd` da.

### 10.2 Design Add and Search Words Data Structure — LC 211 · Medium
- **Voraussetzungen:** 8.1, DFS im Trie.
- **Kernidee:** Der Wildcard `.` macht die Suche zu einer Verzweigung: an dieser Stelle **alle** Kinder rekursiv probieren.
- **Optimal:** Muster **Trie + Backtracking-DFS**. `dfs(index, node)`: bei `.` über alle `children.values()` rekursieren, sonst normal absteigen. Treffer bei `index == len(word) and node.isEnd`.
- **Laufzeit:** O(L) ohne Wildcards, Worst Case O(26^L) bei vielen Punkten · **Speicher:** O(Σ Wortlängen)
- **Fallstricke:** Bei Rekursion in der Schleife bei Erfolg sofort `True` zurückgeben, nicht weitersuchen.

### 10.3 Word Search II — LC 212 · Hard
- **Voraussetzungen:** 8.1, Word Search (11er-Kategorie), Pruning.
- **Kernidee:** Nicht jedes Wort einzeln im Grid suchen, sondern **alle Wörter gleichzeitig** über einen Trie — das Grid wird nur einmal durchlaufen und tote Pfade brechen sofort ab.
- **Optimal:** Muster **Trie + Backtracking**. Alle Wörter in einen Trie. Von jeder Zelle DFS, der parallel im Trie absteigt; existiert das Kind nicht → sofort abbrechen. Besuchte Zellen markieren und danach zurücksetzen. **Pruning:** gefundene Wörter aus dem Trie entfernen bzw. Blätter ohne Kinder abschneiden.
- **Laufzeit:** O(m·n·4^L) Worst Case, praktisch stark reduziert · **Speicher:** O(Σ Wortlängen)
- **Fallstricke:** Ohne Trie ist es O(Wörter × Grid × 4^L) und läuft in Timeout. Doppelte Treffer per Set oder durch Löschen im Trie verhindern.

---

## 11. Graphs (13)

### 11.1 Number of Islands — LC 200 · Medium
- **Voraussetzungen:** Grid-DFS/BFS, Besuchsmarkierung.
- **Kernidee:** Jede noch nicht besuchte `'1'`-Zelle startet eine neue Insel; die Flutfüllung markiert die gesamte Komponente.
- **Optimal:** Muster **Flood Fill (DFS/BFS)**. Über alle Zellen iterieren, bei `'1'` Zähler erhöhen und alle verbundenen Zellen markieren (in-place auf `'0'` setzen spart das visited-Set).
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n) worst case
- **Fallstricke:** Rekursives DFS kann bei großen Grids den Stack sprengen → BFS mit Queue erwähnen. Nur 4 Richtungen, nicht 8.

### 11.2 Max Area of Island — LC 695 · Medium
- **Voraussetzungen:** 11.1.
- **Kernidee:** Identisch zu 11.1, aber die Flutfüllung gibt die **Größe** zurück statt nur zu markieren.
- **Optimal:** Muster **Flood Fill mit Rückgabewert**. `dfs` liefert `1 + dfs(oben) + dfs(unten) + dfs(links) + dfs(rechts)`, Maximum global mitführen.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Zelle **vor** der Rekursion markieren, sonst Endlosschleife/Doppelzählung.

### 11.3 Clone Graph — LC 133 · Medium
- **Voraussetzungen:** DFS/BFS mit Map alt→neu (vgl. LC 138).
- **Kernidee:** Die Map dient gleichzeitig als Klon-Verzeichnis **und** als visited-Set — dadurch terminiert es auch bei Zyklen.
- **Optimal:** Muster **DFS + Hash-Map**. `dfs(node)`: ist node in der Map → Kopie zurückgeben; sonst Kopie anlegen, in Map eintragen, dann für alle Nachbarn `copy.neighbors.append(dfs(nb))`.
- **Laufzeit:** O(V + E) · **Speicher:** O(V)
- **Fallstricke:** Map-Eintrag **vor** dem Nachbarn-Loop setzen. Leerer Graph → `None`.

### 11.4 Walls and Gates — LC 286 · Medium (Premium)
- **Voraussetzungen:** Multi-Source BFS.
- **Kernidee:** Nicht von jedem Raum zum nächsten Tor suchen, sondern **von allen Toren gleichzeitig** nach außen fluten — dann ist jede Zelle beim ersten Erreichen optimal.
- **Optimal:** Muster **Multi-Source BFS**. Alle Tore (`0`) initial in die Queue; pro Ebene Distanz +1; nur Zellen mit `INF` betreten.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Einzel-BFS pro Raum wäre O((m·n)²). `-1` (Wand) nie betreten. Distanz direkt im Grid speichern.

### 11.5 Rotting Oranges — LC 994 · Medium
- **Voraussetzungen:** 11.4, Level-Zählung.
- **Kernidee:** Zeit = Anzahl der BFS-Ebenen ausgehend von allen faulen Orangen gleichzeitig.
- **Optimal:** Muster **Multi-Source BFS mit Level-Zähler**. Frische Orangen vorher zählen; pro Ebene Minuten +1 und Zähler dekrementieren.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Am Ende noch frische Orangen → `-1`. Gar keine frischen Orangen → `0`, nicht die Levelzahl. Minuten erst nach der Prüfung "Queue nicht leer" erhöhen.

### 11.6 Pacific Atlantic Water Flow — LC 417 · Medium
- **Voraussetzungen:** Grid-DFS, Umkehr der Flussrichtung.
- **Kernidee:** Statt von jeder Zelle zu prüfen, ob sie beide Ozeane erreicht: **von den Ozeanrändern rückwärts** bergauf laufen. Der Schnitt beider Mengen ist die Antwort.
- **Optimal:** Muster **Reverse DFS von den Rändern**. Zwei Sets `pac`, `atl`; DFS nur zu Nachbarn mit `height >= aktuell`.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Die Umkehrung ist die ganze Aufgabe (naiv wäre es O((m·n)²)). Vergleich `>=`, gleiche Höhen fließen.

### 11.7 Surrounded Regions — LC 130 · Medium
- **Voraussetzungen:** 11.1, Denken über das Komplement.
- **Kernidee:** Statt umschlossene Regionen zu finden, die **nicht** umschlossenen markieren: alles, was vom Rand aus erreichbar ist, bleibt `'O'`.
- **Optimal:** Muster **Border DFS + Komplement**. Von allen Rand-`'O'` fluten und temporär auf `'T'` setzen; danach alle `'O'` → `'X'`, alle `'T'` → `'O'`.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Alle vier Ränder abarbeiten. Der Drei-Zustands-Trick (`T`) ist sauberer als ein separates Set.

### 11.8 Course Schedule — LC 207 · Medium
- **Voraussetzungen:** Gerichteter Graph, Zyklenerkennung.
- **Kernidee:** Machbar ⟺ der Abhängigkeitsgraph ist **azyklisch**.
- **Optimal:** Muster **Topologische Sortierung (Kahn) oder DFS mit 3 Zuständen**. Kahn: Eingangsgrade berechnen, alle mit Grad 0 in die Queue, abarbeiten und dekrementieren; verarbeitet man alle n Kurse → kein Zyklus. DFS: `weiß/grau/schwarz`; Treffer auf **grau** = Zyklus.
- **Laufzeit:** O(V + E) · **Speicher:** O(V + E)
- **Fallstricke:** Bei DFS reicht ein einfaches visited-Set **nicht** — es braucht den "aktuell im Rekursionspfad"-Zustand.

### 11.9 Course Schedule II — LC 210 · Medium
- **Voraussetzungen:** 11.8.
- **Kernidee:** Gleicher Algorithmus, aber die Reihenfolge ausgeben statt nur ja/nein.
- **Optimal:** Muster **Topologische Sortierung**. Kahn: Abarbeitungsreihenfolge ist direkt die Antwort. DFS: Post-Order sammeln und am Ende **umdrehen**.
- **Laufzeit:** O(V + E) · **Speicher:** O(V + E)
- **Fallstricke:** Zyklus → leeres Array. Kantenrichtung konsistent halten (`prereq → course`). Bei DFS das Umdrehen nicht vergessen.

### 11.10 Graph Valid Tree — LC 261 · Medium (Premium)
- **Voraussetzungen:** Baum-Definition, Union-Find oder DFS.
- **Kernidee:** Ein Graph ist ein Baum ⟺ **genau n-1 Kanten** und **zusammenhängend** (daraus folgt Zyklenfreiheit automatisch).
- **Optimal:** Muster **Union-Find**. `len(edges) != n - 1` → sofort False. Sonst alle Kanten unionieren; ein Union, dessen Endpunkte schon dieselbe Wurzel haben, bedeutet Zyklus → False.
- **Laufzeit:** O(n·α(n)) ≈ O(n) · **Speicher:** O(n)
- **Fallstricke:** Die Kantenzahl-Prüfung spart den Zusammenhangstest. Bei DFS-Lösung die Elternkante ausschließen, sonst falsche Zyklen.

### 11.11 Number of Connected Components in an Undirected Graph — LC 323 · Medium (Premium)
- **Voraussetzungen:** Union-Find oder DFS.
- **Kernidee:** Mit n Komponenten starten; jede erfolgreiche Vereinigung reduziert den Zähler um 1.
- **Optimal:** Muster **Union-Find** mit Pfadkompression und Union by Rank. Alternativ DFS von jedem unbesuchten Knoten und zählen.
- **Laufzeit:** O(V + E) · **Speicher:** O(V)
- **Fallstricke:** Isolierte Knoten zählen als eigene Komponente. Nur dekrementieren, wenn `find(a) != find(b)`.

### 11.12 Redundant Connection — LC 684 · Medium
- **Voraussetzungen:** Union-Find.
- **Kernidee:** Die Kante, deren beide Endpunkte **bereits** in derselben Komponente liegen, schließt den Zyklus — sie ist die gesuchte.
- **Optimal:** Muster **Union-Find**. Kanten der Reihe nach unionieren; die erste fehlschlagende Vereinigung zurückgeben.
- **Laufzeit:** O(n·α(n)) · **Speicher:** O(n)
- **Fallstricke:** Gefragt ist die **letzte** Kante in der Eingabereihenfolge — die Reihenfolge des Durchlaufs liefert sie automatisch. Union-Find-Template hier festigen, es kommt in 12.2 wieder.

### 11.13 Word Ladder — LC 127 · Hard
- **Voraussetzungen:** BFS, implizite Graphen, Nachbarschaftsdefinition.
- **Kernidee:** Wörter sind Knoten, "unterscheidet sich in einem Buchstaben" sind Kanten → kürzester Weg = BFS.
- **Optimal:** Muster **BFS auf implizitem Graphen + Wildcard-Buckets**. Vorverarbeitung: `map["h*t"] = [hot, hit, …]`. So findet man Nachbarn in O(L) statt alle Wörter zu vergleichen. Fortgeschritten: **Bidirektionales BFS** halbiert die Suchtiefe.
- **Laufzeit:** O(N · L²) · **Speicher:** O(N · L²)
- **Fallstricke:** `endWord` muss in der Wortliste sein, sonst 0. Besuchte Wörter sofort entfernen. Paarweiser Vergleich aller Wörter ist O(N²·L) und zu langsam.

---

## 12. Advanced Graphs (6)

### 12.1 Network Delay Time — LC 743 · Medium
- **Voraussetzungen:** Dijkstra.
- **Kernidee:** Kürzeste Wege von einer Quelle bei nichtnegativen Gewichten; die Antwort ist das **Maximum** aller kürzesten Distanzen.
- **Optimal:** Muster **Dijkstra mit Min-Heap**. `(dist, node)` poppen, besuchte überspringen, Nachbarn mit `dist + w` pushen. Am Ende: alle n erreicht? sonst `-1`.
- **Laufzeit:** O(E log V) · **Speicher:** O(V + E)
- **Fallstricke:** Nicht alle Knoten erreichbar → `-1`. Nicht das Minimum, sondern das Maximum zurückgeben. Bei negativen Gewichten wäre Bellman-Ford nötig — Dijkstra gilt hier nur wegen `w ≥ 0`.

### 12.2 Reconstruct Itinerary — LC 332 · Hard
- **Voraussetzungen:** Eulerpfad, Hierholzer-Algorithmus.
- **Kernidee:** Gesucht ist ein **Eulerpfad** (jede Kante genau einmal). Greedy allein sackt in Sackgassen — Hierholzer löst das, indem Knoten erst **nach** Erschöpfen aller Kanten ans Ergebnis kommen.
- **Optimal:** Muster **Hierholzer (Post-Order DFS)**. Ziele pro Start lexikografisch sortieren (Min-Heap oder sortierte Liste, von hinten poppen); DFS, Knoten nach der Rekursion an die Ergebnisliste anhängen, am Ende **umdrehen**.
- **Laufzeit:** O(E log E) · **Speicher:** O(E)
- **Fallstricke:** Naives Backtracking läuft bei großen Eingaben in Timeout. Das Anhängen **nach** der Rekursion ist der ganze Trick. Start immer "JFK".

### 12.3 Min Cost to Connect All Points — LC 1584 · Medium
- **Voraussetzungen:** Minimaler Spannbaum, Prim oder Kruskal.
- **Kernidee:** Vollständiger Graph mit Manhattan-Distanzen; gesucht ist der MST.
- **Optimal:** Muster **Prim mit Min-Heap**. Von Punkt 0 starten, günstigste Kante zu einem unbesuchten Knoten poppen, dessen Kanten pushen, bis alle n besucht sind. Kruskal (Kanten sortieren + Union-Find) ist gleichwertig, aber bei n² Kanten meist langsamer.
- **Laufzeit:** O(n² log n) · **Speicher:** O(n²)
- **Fallstricke:** Beim Poppen prüfen, ob der Knoten schon besucht ist (veraltete Heap-Einträge). Manhattan: `|x1-x2| + |y1-y2|`, kein Euklid.

### 12.4 Swim in Rising Water — LC 778 · Hard
- **Voraussetzungen:** Dijkstra-Variante oder Binärsuche + BFS.
- **Kernidee:** Die Kosten eines Pfades sind nicht die Summe, sondern das **Maximum** der Höhen darauf → Dijkstra mit `max` statt `+`.
- **Optimal:** Muster **Modifizierter Dijkstra (Minimax-Pfad)**. Heap `(maxHöheBisher, r, c)`; Nachbarkosten `max(cur, grid[nr][nc])`. Abbruch bei Erreichen der Zielzelle. Alternative: binäre Suche über t + Erreichbarkeits-BFS → O(n² log n), gleich gut.
- **Laufzeit:** O(n² log n) · **Speicher:** O(n²)
- **Fallstricke:** `max` statt Addition — wer hier addiert, bekommt still falsche Ergebnisse. Startzelle zählt mit.

### 12.5 Alien Dictionary — LC 269 · Hard (Premium)
- **Voraussetzungen:** 11.9, Ableiten von Kanten aus Daten.
- **Kernidee:** Aus jedem benachbarten Wortpaar liefert **nur das erste unterschiedliche Zeichen** eine Ordnungsrelation → daraus einen Graphen bauen und topologisch sortieren.
- **Optimal:** Muster **Graphaufbau + Topologische Sortierung**. Alle vorkommenden Zeichen als Knoten; pro Paar erste Differenz als Kante; Kahn oder DFS-Post-Order.
- **Laufzeit:** O(C) (Gesamtzahl Zeichen) · **Speicher:** O(1) bzw. O(U + Kanten)
- **Fallstricke:** **Ungültiger Sonderfall:** ist `w1` ein Präfix von `w2` und *länger* (`"abc"` vor `"ab"`), ist die Eingabe ungültig → `""`. Nach dem ersten Unterschied `break`. Zyklus → `""`.

### 12.6 Cheapest Flights Within K Stops — LC 787 · Medium
- **Voraussetzungen:** Bellman-Ford, Verständnis der Kantenrelaxierung.
- **Kernidee:** Die Zwischenstopp-Grenze ist eine Grenze für die **Anzahl der Kanten** → genau `k + 1` Relaxierungsrunden.
- **Optimal:** Muster **Bellman-Ford (k+1 Runden)**. Pro Runde eine **Kopie** des Distanzarrays verwenden, damit innerhalb einer Runde keine Kette aus mehreren Kanten entsteht.
- **Laufzeit:** O(k · E) · **Speicher:** O(V)
- **Fallstricke:** Die Kopie ist der entscheidende Punkt — ohne sie überschreitet man die Stopp-Grenze. Reines Dijkstra nach Kosten ist hier **falsch**, weil ein teurerer Weg mit weniger Stopps besser sein kann (nur mit Zustand `(node, stops)` korrekt).

---

## 13. 1-D Dynamic Programming (12)

### 13.1 Climbing Stairs — LC 70 · Easy
- **Voraussetzungen:** Rekurrenz, Fibonacci.
- **Kernidee:** Die letzte Stufe erreicht man von `n-1` oder `n-2` → `dp[n] = dp[n-1] + dp[n-2]`.
- **Optimal:** Muster **Bottom-up DP mit rollenden Variablen**. Zwei Variablen statt Array.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Naive Rekursion ist O(2ⁿ) — nutze sie als Einstieg und zeige den Weg Memoisierung → Tabelle → O(1).

### 13.2 Min Cost Climbing Stairs — LC 746 · Easy
- **Voraussetzungen:** 13.1.
- **Kernidee:** `dp[i]` = minimale Kosten, um Stufe i zu **erreichen** = `cost[i] + min(dp[i-1], dp[i-2])`.
- **Optimal:** Muster **Bottom-up DP, rollende Variablen**. Von hinten rechnen oder von vorn; Antwort `min(dp[n-1], dp[n-2])`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Start ist Stufe 0 **oder** 1. Das Ziel liegt **hinter** dem letzten Element.

### 13.3 House Robber — LC 198 · Medium
- **Voraussetzungen:** Zustandsdefinition mit Ausschlussbedingung.
- **Kernidee:** Pro Haus zwei Optionen: nehmen (+ bestes Ergebnis bis `i-2`) oder auslassen (Ergebnis bis `i-1`).
- **Optimal:** Muster **Bottom-up DP**. `rob1, rob2 = rob2, max(rob1 + num, rob2)`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Alle Werte nichtnegativ — deshalb ist `max` mit 0 unnötig. Basismuster für 13.4 und viele Varianten.

### 13.4 House Robber II — LC 213 · Medium
- **Voraussetzungen:** 13.3.
- **Kernidee:** Kreis → erstes und letztes Haus schließen sich aus. Also zweimal die lineare Lösung: einmal ohne das letzte, einmal ohne das erste Haus.
- **Optimal:** Muster **Problemreduktion**. `max(rob(nums[:-1]), rob(nums[1:]))`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Sonderfall `n == 1` (beide Slices leer). Nicht versuchen, den Kreis in einer DP zu modellieren — die Reduktion ist die saubere Antwort.

### 13.5 Longest Palindromic Substring — LC 5 · Medium
- **Voraussetzungen:** Symmetrie-Denken.
- **Kernidee:** Ein Palindrom wächst um sein Zentrum → alle 2n-1 Zentren (n einzeln + n-1 zwischen den Zeichen) ausdehnen.
- **Optimal:** Muster **Expand Around Center**. Zwei Zeiger vom Zentrum nach außen, längsten Treffer merken. Speicher O(1), anders als bei der DP-Tabelle.
- **Laufzeit:** O(n²) · **Speicher:** O(1)
- **Fallstricke:** Beide Zentrumstypen (ungerade **und** gerade Länge) prüfen. Manacher (O(n)) nur erwähnen, nicht implementieren.

### 13.6 Palindromic Substrings — LC 647 · Medium
- **Voraussetzungen:** 13.5.
- **Kernidee:** Identisches Verfahren, aber **zählen** statt maximieren — jede erfolgreiche Ausdehnung ist ein weiteres Palindrom.
- **Optimal:** Muster **Expand Around Center**, Zähler in der Ausdehnungsschleife inkrementieren.
- **Laufzeit:** O(n²) · **Speicher:** O(1)
- **Fallstricke:** Einzelzeichen zählen mit (mindestens n Ergebnisse).

### 13.7 Decode Ways — LC 91 · Medium
- **Voraussetzungen:** 13.1, sorgfältige Fallunterscheidung.
- **Kernidee:** Wie Climbing Stairs, aber jeder Schritt hat eine Gültigkeitsbedingung: 1 Ziffer nur wenn ≠ '0', 2 Ziffern nur wenn 10–26.
- **Optimal:** Muster **Bottom-up DP mit Bedingungen**. `dp[i] = (dp[i+1] wenn s[i] != '0') + (dp[i+2] wenn s[i:i+2] in 10..26)`. Zwei Variablen reichen.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** **Nullen sind die ganze Schwierigkeit:** führende '0' → 0 Wege; "06" ist ungültig; "10" und "20" haben genau einen Weg. Testfälle: `"0"`, `"06"`, `"100"`, `"230"`.

### 13.8 Coin Change — LC 322 · Medium
- **Voraussetzungen:** Unbounded Knapsack, Unerreichbarkeits-Sentinel.
- **Kernidee:** `dp[a]` = minimale Münzzahl für Betrag a = `1 + min(dp[a - c])` über alle Münzen c.
- **Optimal:** Muster **Bottom-up DP (unbounded)**. Array der Größe `amount+1`, mit `∞` initialisieren, `dp[0] = 0`, zwei verschachtelte Schleifen.
- **Laufzeit:** O(amount · #coins) · **Speicher:** O(amount)
- **Fallstricke:** **Greedy ist hier falsch** (Gegenbeispiel: coins `[1,3,4]`, amount 6 → greedy 3 Münzen, optimal 2). Nicht erreichbar → `-1`.

### 13.9 Maximum Product Subarray — LC 152 · Medium
- **Voraussetzungen:** Kadane, Umgang mit Vorzeichenwechsel.
- **Kernidee:** Ein negativer Faktor macht aus dem **kleinsten** Produkt das größte → man muss Minimum und Maximum gleichzeitig mitführen.
- **Optimal:** Muster **Kadane-Variante mit zwei Zuständen**. `curMax, curMin = max(n, curMax*n, curMin*n), min(n, curMax*n, curMin*n)` — beide **gleichzeitig** aktualisieren (alten curMax zwischenspeichern!).
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Nullen setzen beide Zustände zurück (deshalb das `n` allein in `max`/`min`). Das sequentielle Überschreiben von curMax vor curMin ist ein häufiger stiller Bug.

### 13.10 Word Break — LC 139 · Medium
- **Voraussetzungen:** DP über Stringpositionen, Set-Lookup.
- **Kernidee:** `dp[i]` = "Suffix ab i ist zerlegbar" ⟺ es gibt ein Wort w mit `s[i:i+len(w)] == w` und `dp[i + len(w)]`.
- **Optimal:** Muster **Bottom-up DP über Positionen**. Von hinten nach vorn, `dp[n] = True`. Wörter in ein Set; alternativ Trie für große Wörterbücher.
- **Laufzeit:** O(n · m · L) · **Speicher:** O(n)
- **Fallstricke:** Wörter dürfen mehrfach verwendet werden. Reines Backtracking ohne Memo läuft in Timeout (`"aaaa…ab"`).

### 13.11 Longest Increasing Subsequence — LC 300 · Medium
- **Voraussetzungen:** DP O(n²) **und** Patience Sorting mit Binärsuche.
- **Kernidee (O(n²)):** `dp[i]` = längste LIS, die bei i endet = `1 + max(dp[j])` für alle `j < i` mit `nums[j] < nums[i]`.
- **Optimal (O(n log n)):** Muster **Greedy + Binärsuche**. Liste `tails`, wobei `tails[k]` das kleinste mögliche Endelement einer Teilfolge der Länge k+1 ist. Für jedes x per Binärsuche die erste Position mit `tails[i] >= x` finden und ersetzen; gibt es keine, anhängen. Antwort = `len(tails)`.
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** `tails` ist **nicht** die tatsächliche LIS, nur deren Länge stimmt. Für "strictly increasing" `bisect_left` benutzen, für "non-decreasing" `bisect_right`.

### 13.12 Partition Equal Subset Sum — LC 416 · Medium
- **Voraussetzungen:** 0/1-Knapsack, Set- oder Bitset-DP.
- **Kernidee:** Zwei gleiche Hälften existieren ⟺ eine Teilmenge mit Summe `total / 2` existiert → Subset-Sum-Problem.
- **Optimal:** Muster **0/1-Knapsack**. Boolean-Array `dp[0..target]`, `dp[0] = True`; pro Zahl **rückwärts** von target nach num iterieren (verhindert Mehrfachnutzung). Elegante Variante: Set von erreichbaren Summen, oder Bitset-Shift.
- **Laufzeit:** O(n · sum/2) · **Speicher:** O(sum/2)
- **Fallstricke:** Ungerade Gesamtsumme → sofort `False`. Die **Rückwärts**-Iteration ist der Unterschied zwischen 0/1 und unbounded Knapsack.

---

## 14. 2-D Dynamic Programming (11)

### 14.1 Unique Paths — LC 62 · Medium
- **Voraussetzungen:** Gitter-DP.
- **Kernidee:** Jedes Feld erreicht man nur von oben oder links → `dp[i][j] = dp[i-1][j] + dp[i][j-1]`.
- **Optimal:** Muster **Gitter-DP, zeilenweise**. Eine Zeile rollend genügt: `row[j] += row[j-1]`. Mathematisch sogar geschlossen: `C(m+n-2, m-1)`.
- **Laufzeit:** O(m·n) · **Speicher:** O(n)
- **Fallstricke:** Randzeile/-spalte = 1. Die Binomial-Lösung als Bonus erwähnen.

### 14.2 Longest Common Subsequence — LC 1143 · Medium
- **Voraussetzungen:** String-DP über zwei Indizes.
- **Kernidee:** Stimmen die aktuellen Zeichen überein, beide Zeiger weiter (+1); sonst das Beste aus "links weiter" und "rechts weiter".
- **Optimal:** Muster **2-D String-DP**. Tabelle `(m+1) × (n+1)`, von hinten füllen. Speicher auf zwei Zeilen reduzierbar → O(min(m,n)).
- **Laufzeit:** O(m·n) · **Speicher:** O(min(m,n))
- **Fallstricke:** Subsequence ≠ Substring (nicht zusammenhängend!). Dieses Schema trägt 14.8 und 14.9 mit.

### 14.3 Best Time to Buy and Sell Stock with Cooldown — LC 309 · Medium
- **Voraussetzungen:** DP mit Zustandsautomat.
- **Kernidee:** Der Zustand ist nicht nur der Tag, sondern `(Tag, darf ich kaufen?)` — nach einem Verkauf ist ein Tag gesperrt.
- **Optimal:** Muster **State-Machine-DP**. Drei rollende Zustände: `hold` (halte Aktie), `sold` (heute verkauft), `rest` (frei). Übergänge: `hold = max(hold, rest - p)`, `sold = hold + p`, `rest = max(rest, sold_prev)`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Die Übergänge müssen die **Vorwerte** benutzen — Reihenfolge des Überschreibens beachten. Cooldown gilt nur nach Verkauf, nicht nach Kauf.

### 14.4 Coin Change II — LC 518 · Medium
- **Voraussetzungen:** 13.8, Unterschied Kombinationen vs. Permutationen.
- **Kernidee:** Gezählt werden **Kombinationen** — dafür muss die Münzschleife **außen** liegen, sonst zählt man Reihenfolgen mit.
- **Optimal:** Muster **Unbounded Knapsack (Zählvariante)**. `dp[0] = 1`; `for coin: for a in coin..amount: dp[a] += dp[a - coin]`.
- **Laufzeit:** O(amount · #coins) · **Speicher:** O(amount)
- **Fallstricke:** **Schleifenreihenfolge ist die ganze Aufgabe.** Innen die Münzen → man zählt Permutationen (das wäre LC 377). Vorwärts-Iteration über `a`, weil Münzen mehrfach zählen.

### 14.5 Target Sum — LC 494 · Medium
- **Voraussetzungen:** Memoisierung über `(index, laufendeSumme)`.
- **Kernidee:** Pro Zahl zwei Zweige (+/−); ohne Memo 2ⁿ, mit Memo kollabieren gleiche `(i, sum)`-Zustände.
- **Optimal:** Muster **DP mit Memo-Dictionary**. `dfs(i, total)` mit Cache. Alternative Umformung: Menge P mit `sum(P) = (total + target) / 2` → reines Subset-Sum wie 13.12.
- **Laufzeit:** O(n · sum) · **Speicher:** O(n · sum)
- **Fallstricke:** Summen können negativ werden → Dictionary statt Array (oder Offset). Bei der Umformung: `(total + target)` muss gerade und nichtnegativ sein.

### 14.6 Interleaving String — LC 97 · Medium
- **Voraussetzungen:** 2-D DP über zwei Zeiger.
- **Kernidee:** Der Zustand `(i, j)` bestimmt die Position in s3 eindeutig (`k = i + j`) — man braucht also keinen dritten Index.
- **Optimal:** Muster **2-D DP**. `dp[i][j] = (s1[i]==s3[i+j] and dp[i+1][j]) or (s2[j]==s3[i+j] and dp[i][j+1])`. Auf eine Zeile reduzierbar.
- **Laufzeit:** O(m·n) · **Speicher:** O(n)
- **Fallstricke:** Sofort `False`, wenn `len(s1) + len(s2) != len(s3)`. Greedy scheitert bei gleichen Zeichen in s1 und s2.

### 14.7 Longest Increasing Path in a Matrix — LC 329 · Hard
- **Voraussetzungen:** DFS + Memoisierung auf Grid.
- **Kernidee:** Weil der Pfad **streng steigend** ist, kann es keine Zyklen geben → kein visited-Set nötig, reine Memoisierung genügt.
- **Optimal:** Muster **DFS + Memo (DAG-DP)**. `memo[r][c]` = längster Pfad ab dieser Zelle = `1 + max(dfs(Nachbar))` für alle größeren Nachbarn. Von jeder Zelle starten, globales Maximum.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** Ohne Memo wird es exponentiell. Der Zyklenfreiheits-Grund sollte im Interview genannt werden — er ist der Kern.

### 14.8 Distinct Subsequences — LC 115 · Hard
- **Voraussetzungen:** 14.2, Zählen statt Maximieren.
- **Kernidee:** Bei Zeichenübereinstimmung hat man **zwei** Möglichkeiten: das Zeichen matchen (beide Zeiger weiter) **oder** überspringen (nur s weiter) — beide Zählungen addieren.
- **Optimal:** Muster **2-D Zähl-DP**. `dp[i][j] = dp[i+1][j+1] + dp[i+1][j]` bei Match, sonst `dp[i+1][j]`. Basis: `dp[i][n] = 1` (t vollständig gematcht), `dp[m][j] = 0`.
- **Laufzeit:** O(m·n) · **Speicher:** O(n)
- **Fallstricke:** Addieren, nicht `max` — es wird gezählt. Die Basisfälle sind hier asymmetrisch und leicht zu verwechseln.

### 14.9 Edit Distance — LC 72 · Medium
- **Voraussetzungen:** 14.2, drei Operationen sauber trennen.
- **Kernidee:** Bei Ungleichheit die günstigste der drei Operationen wählen: Ersetzen (`dp[i+1][j+1]`), Löschen (`dp[i+1][j]`), Einfügen (`dp[i][j+1]`) — jeweils +1.
- **Optimal:** Muster **2-D String-DP (Levenshtein)**. Basis: `dp[i][n] = m - i`, `dp[m][j] = n - j`. Bei Zeichengleichheit Kosten 0 und diagonal weiter.
- **Laufzeit:** O(m·n) · **Speicher:** O(min(m,n))
- **Fallstricke:** Welche Zelle zu welcher Operation gehört, muss man sich einmal sauber herleiten (nicht auswendig). Leerstring-Ränder korrekt initialisieren.

### 14.10 Burst Balloons — LC 312 · Hard
- **Voraussetzungen:** Intervall-DP, Umkehrung der Denkrichtung.
- **Kernidee:** Vorwärts zu denken scheitert, weil das Zerplatzen die Nachbarschaft ändert. Rückwärts: frage, welcher Ballon im Intervall **zuletzt** platzt — dann sind seine Nachbarn garantiert die Intervallgrenzen, und links/rechts werden unabhängig.
- **Optimal:** Muster **Intervall-DP**. Array mit 1 an beiden Enden padden. `dp[l][r] = max über k in [l,r] von nums[l-1]*nums[k]*nums[r+1] + dp[l][k-1] + dp[k+1][r]`. Nach Intervalllänge aufsteigend füllen.
- **Laufzeit:** O(n³) · **Speicher:** O(n²)
- **Fallstricke:** "Zuletzt" statt "zuerst" ist der komplette Trick — ohne ihn sind die Teilprobleme nicht unabhängig. Die Padding-Indizes sind fehleranfällig.

### 14.11 Regular Expression Matching — LC 10 · Hard
- **Voraussetzungen:** 14.9, sehr saubere Fallunterscheidung bei `*`.
- **Kernidee:** `*` bedeutet zwei Zweige: **null Vorkommen** (Muster um 2 weiter) oder **ein weiteres Vorkommen** (String um 1 weiter, Muster bleibt).
- **Optimal:** Muster **2-D DP / Memo-Rekursion**. `match = i < m and (s[i] == p[j] or p[j] == '.')`. Bei `p[j+1] == '*'`: `dp[i][j] = dp[i][j+2] or (match and dp[i+1][j])`. Sonst `match and dp[i+1][j+1]`.
- **Laufzeit:** O(m·n) · **Speicher:** O(m·n)
- **Fallstricke:** `*` bezieht sich auf das **vorherige** Zeichen. Der Null-Vorkommen-Zweig muss auch greifen, wenn der String schon zu Ende ist (`"" vs "a*b*"` → True). Diese Aufgabe ist die schwerste des Sets — Struktur vor Geschwindigkeit.

---

## 15. Greedy (8)

### 15.1 Maximum Subarray — LC 53 · Medium
- **Voraussetzungen:** Kadane-Algorithmus.
- **Kernidee:** Ein negatives Präfix zu behalten kann nie helfen → sobald die laufende Summe negativ wird, zurücksetzen.
- **Optimal:** Muster **Kadane / Greedy**. `cur = max(num, cur + num)`, `res = max(res, cur)`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** `res` mit `nums[0]` bzw. `-∞` initialisieren, nicht mit 0 (alle Werte könnten negativ sein). Divide-and-Conquer-Variante O(n log n) als Follow-up kennen.

### 15.2 Jump Game — LC 55 · Medium
- **Voraussetzungen:** Greedy mit rückwärts wanderndem Ziel.
- **Kernidee:** Von hinten denken: verschiebe das "Ziel" nach links, wann immer eine Position es erreicht. Bleibt am Ende Ziel = 0, ist es machbar.
- **Optimal:** Muster **Greedy (rückwärts)**. `goal = n-1`; `for i in range(n-2, -1, -1): if i + nums[i] >= goal: goal = i`. Vorwärts-Variante: maximale Reichweite mitführen und bei `i > reach` abbrechen.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** DP wäre O(n²) und unnötig. Nullen sind die kritischen Stellen.

### 15.3 Jump Game II — LC 45 · Medium
- **Voraussetzungen:** 15.2, BFS-Denken auf Intervallen.
- **Kernidee:** Wie BFS in Levels: das aktuell erreichbare Fenster `[l, r]` komplett abgrasen, daraus das neue `r` bestimmen — jedes Fenster ist ein Sprung.
- **Optimal:** Muster **Greedy / implizites BFS**. `while r < n-1`: `farthest = max(i + nums[i]) für i in [l, r]`, dann `l = r + 1`, `r = farthest`, `res += 1`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Erreichbarkeit ist garantiert — nicht prüfen. Die Fenstergrenzen nicht überlaufen lassen.

### 15.4 Gas Station — LC 134 · Medium
- **Voraussetzungen:** Greedy + Existenzargument.
- **Kernidee:** Ist die Gesamtsumme `gas - cost` ≥ 0, existiert garantiert eine Lösung. Wird der Tank ab Start s negativ, kann **keine** Station zwischen s und der Bruchstelle Startpunkt sein → direkt hinter der Bruchstelle neu starten.
- **Optimal:** Muster **Greedy, ein Durchlauf**. `total` und `tank` mitführen; bei `tank < 0` → `res = i + 1`, `tank = 0`. Antwort: `res` falls `total >= 0`, sonst `-1`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Das Existenzargument muss man aussprechen können — sonst wirkt die Lösung geraten. Brute Force wäre O(n²).

### 15.5 Hand of Straights — LC 846 · Medium
- **Voraussetzungen:** Counter, Min-Heap oder sortierte Keys.
- **Kernidee:** Die jeweils **kleinste** verbliebene Karte muss zwingend Anfang einer Gruppe sein — daraus folgt die Gruppe eindeutig.
- **Optimal:** Muster **Greedy + Counter**. Counter bauen; Min-Heap über die Keys; kleinste Karte x nehmen, `x, x+1, …, x+k-1` je einmal dekrementieren; fehlt eine → `False`.
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** `len(hand) % groupSize != 0` → sofort `False`. Beim Heap-Poppen darauf achten, dass ein Zwischenwert mit Count 0 nicht mittendrin verworfen wird.

### 15.6 Merge Triplets to Form Target Triplet — LC 1899 · Medium
- **Voraussetzungen:** Elementweises Maximum, Filterlogik.
- **Kernidee:** Ein Triplet mit *irgendeinem* Wert > Target ist **giftig** und darf nie benutzt werden. Von den übrigen kann man bedenkenlos alle mergen — dann muss jede Position mindestens einmal exakt getroffen werden.
- **Optimal:** Muster **Greedy Filter + Set**. Über alle Triplets: wenn alle drei Werte ≤ Target, dann jede Position mit `t[i] == target[i]` in ein Set legen. Antwort: `len(set) == 3`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Der Filterschritt ist zwingend — ohne ihn ist die Lösung falsch. `max` ist verlustfrei kombinierbar, deshalb funktioniert das Sammeln.

### 15.7 Partition Labels — LC 763 · Medium
- **Voraussetzungen:** Letztes Vorkommen pro Zeichen, Greedy-Fenster.
- **Kernidee:** Ein Abschnitt darf erst enden, wenn das letzte Vorkommen **aller** darin enthaltenen Zeichen erreicht ist.
- **Optimal:** Muster **Greedy + Vorberechnung**. Map `Zeichen → letzter Index`. Durchlaufen, `end = max(end, last[c])`; bei `i == end` Abschnitt schließen und Länge notieren.
- **Laufzeit:** O(n) · **Speicher:** O(1) (26 Zeichen)
- **Fallstricke:** Zwei Durchläufe nötig (erst die Map). Länge = `i - start + 1`.

### 15.8 Valid Parenthesis String — LC 678 · Medium
- **Voraussetzungen:** Zählung mit Intervall statt Einzelwert.
- **Kernidee:** Der Stern macht die Anzahl offener Klammern unsicher → ein **Bereich** `[minOpen, maxOpen]` mitführen statt eines Zählers.
- **Optimal:** Muster **Greedy mit Intervall**. `(` → beide +1; `)` → beide −1; `*` → `minOpen -1`, `maxOpen +1`. Wird `maxOpen < 0` → `False`; `minOpen` bei 0 clampen. Gültig ⟺ am Ende `minOpen == 0`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Das Clampen von `minOpen` auf 0 nicht vergessen (ein Stern kann auch leer sein). Zwei-Stacks-Lösung existiert, das Intervall ist eleganter.

---

## 16. Intervals (6)

### 16.1 Insert Interval — LC 57 · Medium
- **Voraussetzungen:** Sortierte, disjunkte Eingabe; Fallunterscheidung.
- **Kernidee:** Drei Phasen: alle Intervalle komplett **links** übernehmen, alle überlappenden zu einem verschmelzen, den Rest **rechts** anhängen.
- **Optimal:** Muster **Linearer Scan**. Phase 1: `end < new.start` → übernehmen. Phase 2: solange `start <= new.end` → `new = [min(starts), max(ends)]`. Phase 3: Rest.
- **Laufzeit:** O(n) (kein Sortieren nötig!) · **Speicher:** O(n)
- **Fallstricke:** Einfügen an erster/letzter Position. Berührende Intervalle (`[1,2]` und `[2,3]`) gelten hier als überlappend.

### 16.2 Merge Intervals — LC 56 · Medium
- **Voraussetzungen:** Sortieren nach Start.
- **Kernidee:** Nach dem Sortieren überlappt jedes Intervall höchstens mit dem zuletzt ausgegebenen.
- **Optimal:** Muster **Sortieren + Linearer Scan**. `if start <= res[-1][1]: res[-1][1] = max(res[-1][1], end)` sonst anhängen.
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** `max` beim Verschmelzen — ein enthaltenes Intervall (`[1,10]`, `[2,3]`) darf das Ende nicht verkürzen.

### 16.3 Non-overlapping Intervals — LC 435 · Medium
- **Voraussetzungen:** Activity Selection, Greedy-Beweis.
- **Kernidee:** Um möglichst wenige zu entfernen, behält man möglichst viele — und dabei ist immer das Intervall mit dem **frühesten Ende** die beste Wahl.
- **Optimal:** Muster **Greedy, sortiert nach Endzeit**. `prevEnd` mitführen; `start >= prevEnd` → behalten und `prevEnd` setzen, sonst Zähler +1 (entfernen).
- **Laufzeit:** O(n log n) · **Speicher:** O(1)
- **Fallstricke:** **Nach Ende sortieren, nicht nach Start** — nach Start funktioniert es nur mit zusätzlicher `min(end)`-Logik. Berührende Intervalle überlappen hier **nicht**.

### 16.4 Meeting Rooms — LC 252 · Easy (Premium)
- **Voraussetzungen:** Sortieren.
- **Kernidee:** Nach Start sortiert genügt der Vergleich benachbarter Paare.
- **Optimal:** Muster **Sortieren + Nachbarvergleich**. `if intervals[i].start < intervals[i-1].end: return False`.
- **Laufzeit:** O(n log n) · **Speicher:** O(1)
- **Fallstricke:** `<` statt `<=` — ein Meeting darf beginnen, wenn das vorige endet.

### 16.5 Meeting Rooms II — LC 253 · Medium (Premium)
- **Voraussetzungen:** Min-Heap **oder** Sweep Line.
- **Kernidee:** Gesucht ist die maximale gleichzeitige Überlappung. Bei chronologischer Betrachtung: jeder Start +1, jedes Ende −1, Maximum des laufenden Zählers.
- **Optimal:** Muster **Sweep Line**. Start- und Endzeiten getrennt sortieren, zwei Zeiger; `start < end` → Zähler +1 und Startzeiger vor, sonst Zähler −1. Heap-Variante: Endzeiten der belegten Räume im Min-Heap.
- **Laufzeit:** O(n log n) · **Speicher:** O(n)
- **Fallstricke:** Bei Gleichstand von Start und Ende zuerst das Ende verarbeiten (Raum wird frei). Heap-Lösung ist im Interview meist die leichter erklärbare.

### 16.6 Minimum Interval to Include Each Query — LC 1851 · Hard
- **Voraussetzungen:** Sortieren + Min-Heap, Offline-Verarbeitung von Queries.
- **Kernidee:** Queries **sortiert** abarbeiten (offline). Dann kann man Intervalle inkrementell hinzufügen und abgelaufene lazy entfernen.
- **Optimal:** Muster **Sweep Line + Min-Heap (nach Länge)**. Intervalle nach Start sortieren, Queries nach Wert sortiert durchgehen. Alle Intervalle mit `start <= q` in den Heap `(länge, ende)`; oben alle mit `ende < q` verwerfen; `heap[0][0]` ist die Antwort. Ergebnisse per Originalindex zurückmappen.
- **Laufzeit:** O(n log n + q log q) · **Speicher:** O(n + q)
- **Fallstricke:** Die Originalreihenfolge der Queries muss wiederhergestellt werden. Keine Abdeckung → `-1`. Die schwerste Aufgabe der Kategorie.

---

## 17. Math & Geometry (8)

### 17.1 Rotate Image — LC 48 · Medium
- **Voraussetzungen:** In-Place-Matrixoperationen.
- **Kernidee:** 90° im Uhrzeigersinn = **transponieren** und dann jede Zeile **spiegeln**.
- **Optimal:** Muster **Transponieren + Reverse**. Oder ringweise Vierertausch von außen nach innen mit einer Temp-Variablen.
- **Laufzeit:** O(n²) · **Speicher:** O(1)
- **Fallstricke:** Beim Transponieren nur die obere Dreiecksmatrix durchlaufen (`j` ab `i+1`), sonst tauscht man doppelt zurück. Gegen den Uhrzeigersinn: erst spiegeln, dann transponieren.

### 17.2 Spiral Matrix — LC 54 · Medium
- **Voraussetzungen:** Grenzenverwaltung.
- **Kernidee:** Vier Grenzen (`top, bottom, left, right`) führen und nach jedem Durchlauf nach innen ziehen.
- **Optimal:** Muster **Boundary Traversal**. Reihenfolge: rechts, runter, links, hoch; nach jeder Richtung die Grenze anpassen.
- **Laufzeit:** O(m·n) · **Speicher:** O(1)
- **Fallstricke:** Bei nicht-quadratischen Matrizen **vor** der dritten und vierten Richtung prüfen, ob noch Zeilen/Spalten übrig sind — sonst doppelte Ausgabe. Alternativ per `len(res) < m*n` abbrechen.

### 17.3 Set Matrix Zeroes — LC 73 · Medium
- **Voraussetzungen:** In-Place-Marker-Technik.
- **Kernidee:** Die erste Zeile und erste Spalte als **Marker-Speicher** zweckentfremden, statt eigene Sets anzulegen.
- **Optimal:** Muster **In-Place-Marking**. Merken, ob die erste Zeile/Spalte selbst eine Null enthält; dann jede Null nach `matrix[i][0]` und `matrix[0][j]` markieren; von innen nach außen nullen; zuletzt erste Zeile/Spalte behandeln.
- **Laufzeit:** O(m·n) · **Speicher:** O(1)
- **Fallstricke:** Die Zelle `[0][0]` ist doppelt belegt → separates Flag. Nicht während des ersten Durchlaufs nullen (das würde neue "Nullen" erzeugen).

### 17.4 Happy Number — LC 202 · Easy
- **Voraussetzungen:** Ziffernzerlegung, Zyklenerkennung.
- **Kernidee:** Die Folge landet entweder bei 1 oder in einem Zyklus → Zyklus erkennen.
- **Optimal:** Muster **Floyd's Fast/Slow** (O(1) Speicher) oder Set (O(log n) Speicher, einfacher).
- **Laufzeit:** O(log n) · **Speicher:** O(1) mit Floyd
- **Fallstricke:** Der Fast/Slow-Ansatz auf einer Zahlenfolge ist die elegante Antwort — das Set genügt aber und ist schneller geschrieben.

### 17.5 Plus One — LC 66 · Easy
- **Voraussetzungen:** Übertragslogik.
- **Kernidee:** Von hinten: `9` → `0` und weiter, alles andere → +1 und fertig.
- **Optimal:** Muster **Simulation**. Sind alle Stellen 9, vorne eine 1 einfügen.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** `[9,9,9]` → `[1,0,0,0]`. Nicht in Integer konvertieren (Overflow-Argument).

### 17.6 Pow(x, n) — LC 50 · Medium
- **Voraussetzungen:** Binäre Exponentiation, Rekursion.
- **Kernidee:** `x^n = (x^(n/2))²` → jede Halbierung des Exponenten spart die Hälfte der Multiplikationen.
- **Optimal:** Muster **Fast Power / Divide & Conquer**. Rekursiv `half = pow(x, n//2)`, Ergebnis `half*half` (bei ungeradem n zusätzlich `*x`). Iterativ über die Bits von n.
- **Laufzeit:** O(log n) · **Speicher:** O(log n) rekursiv, O(1) iterativ
- **Fallstricke:** Negatives n → `1 / pow(x, -n)`. `n = 0` → 1. In C++/Java: `-2^31` negieren overflowt → `long` benutzen.

### 17.7 Multiply Strings — LC 43 · Medium
- **Voraussetzungen:** Schriftliche Multiplikation, Index-Arithmetik.
- **Kernidee:** Das Produkt von Ziffer i und Ziffer j landet immer an den Positionen `i+j` und `i+j+1`.
- **Optimal:** Muster **Simulation mit Ergebnisarray**. Array der Länge `m+n`; doppelte Schleife von hinten; `sum = digit + res[i+j+1]`; `res[i+j+1] = sum % 10`, `res[i+j] += sum // 10`. Am Ende führende Nullen entfernen.
- **Laufzeit:** O(m·n) · **Speicher:** O(m+n)
- **Fallstricke:** `"0"` als Faktor → `"0"`. Keine BigInteger-Konvertierung (das ist der Sinn der Aufgabe). Die Indexformel muss man sich herleiten, nicht raten.

### 17.8 Detect Squares — LC 2013 · Medium
- **Voraussetzungen:** Hash-Map-Design, Geometrie achsenparalleler Quadrate.
- **Kernidee:** Ein Punkt kann nur mit einem **diagonal** gegenüberliegenden Punkt (gleiche |dx| = |dy|, beide ≠ 0) ein Quadrat bilden; die beiden fehlenden Ecken sind dann eindeutig.
- **Optimal:** Muster **Hash-Map + Kombinatorik**. Counter über Punkte, zusätzlich Liste aller Punkte. Für die Anfrage `(x, y)`: über alle gespeicherten Punkte `(px, py)` mit `abs(px-x) == abs(py-y) != 0`; Produkt der Zähler der beiden fehlenden Ecken addieren.
- **Laufzeit:** `add` O(1), `count` O(n) · **Speicher:** O(n)
- **Fallstricke:** Duplikate zählen (deshalb Counter, nicht Set). `dx != 0` ausschließen, sonst degeneriert das "Quadrat". Nur achsenparallele Quadrate.

---

## 18. Bit Manipulation (7)

### 18.1 Single Number — LC 136 · Easy
- **Voraussetzungen:** XOR-Eigenschaften.
- **Kernidee:** XOR über alles: Paare löschen sich gegenseitig aus, übrig bleibt der Einzelgänger.
- **Optimal:** Muster **XOR-Akkumulation**. `res ^= num`.
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Keine. Varianten (LC 137: alle dreimal außer einem; LC 260: zwei Einzelgänger) kennen — sie kommen als Follow-up.

### 18.2 Number of 1 Bits — LC 191 · Easy
- **Voraussetzungen:** Bitmasken.
- **Kernidee:** `n & (n - 1)` entfernt genau das niedrigste gesetzte Bit — also so oft anwenden, bis n null ist.
- **Optimal:** Muster **Brian-Kernighan**. Läuft in O(Anzahl gesetzter Bits) statt O(32).
- **Laufzeit:** O(k) · **Speicher:** O(1)
- **Fallstricke:** Die naive Schleife über 32 Bits ist akzeptabel; Kernighan ist die bessere Antwort und in einer Zeile erklärbar.

### 18.3 Counting Bits — LC 338 · Easy
- **Voraussetzungen:** 18.2, DP.
- **Kernidee:** `bits[i] = bits[i >> 1] + (i & 1)` — die Bitzahl von i ist die von i/2 plus dem letzten Bit.
- **Optimal:** Muster **DP mit Bit-Rekurrenz**. Alternative Formulierung: `bits[i] = bits[i & (i-1)] + 1`.
- **Laufzeit:** O(n) · **Speicher:** O(n)
- **Fallstricke:** Pro Zahl einzeln zählen wäre O(n log n) — die Aufgabe will explizit die lineare DP-Lösung.

### 18.4 Reverse Bits — LC 190 · Easy
- **Voraussetzungen:** Shift und Maskierung, 32-Bit-Fixgröße.
- **Kernidee:** Bit i wandert auf Position `31 - i`.
- **Optimal:** Muster **Bit-für-Bit-Aufbau**. `for i in range(32): bit = (n >> i) & 1; res |= bit << (31 - i)`. Divide-and-Conquer-Variante (Hälften/Viertel/... tauschen) läuft in O(log 32).
- **Laufzeit:** O(32) = O(1) · **Speicher:** O(1)
- **Fallstricke:** In Python hat int keine feste Breite → immer explizit 32 Runden. In Java `>>>` (unsigned shift) benutzen.

### 18.5 Missing Number — LC 268 · Easy
- **Voraussetzungen:** Gauß-Summe oder XOR.
- **Kernidee:** Zwei Wege: `n(n+1)/2 - Σ nums`, oder alle Indizes **und** alle Werte XOR-en — alles außer der fehlenden Zahl paart sich weg.
- **Optimal:** Muster **XOR** (overflow-sicher) oder **Summenformel** (intuitiver).
- **Laufzeit:** O(n) · **Speicher:** O(1)
- **Fallstricke:** Bei sehr großem n kann die Summe overflowen (in Java/C++) — deshalb ist XOR die robustere Antwort, und genau das sollte man sagen.

### 18.6 Sum of Two Integers — LC 371 · Medium
- **Voraussetzungen:** Volladdierer-Logik, Zweierkomplement.
- **Kernidee:** `a ^ b` ist die Summe **ohne** Überträge, `(a & b) << 1` sind die Überträge — wiederholen, bis kein Übertrag mehr übrig ist.
- **Optimal:** Muster **Bitweise Addition**. `while b: a, b = a ^ b, (a & b) << 1`.
- **Laufzeit:** O(32) = O(1) · **Speicher:** O(1)
- **Fallstricke:** **Python ist hier ein Sonderfall:** unbegrenzte Ints lassen negative Zahlen endlos laufen → mit `0xFFFFFFFF` maskieren und am Ende bei gesetztem Vorzeichenbit zurückrechnen (`~(a ^ mask)`). In Java/C++ ist der Code direkt korrekt.

### 18.7 Reverse Integer — LC 7 · Medium
- **Voraussetzungen:** 32-Bit-Grenzen, Overflow-Prüfung **vor** der Operation.
- **Kernidee:** Ziffern per `% 10` abziehen und per `* 10` neu aufbauen — vor jeder Multiplikation prüfen, ob die Grenze gerissen wird.
- **Optimal:** Muster **Simulation mit Overflow-Guard**. Prüfen: `res > MAX//10` oder (`res == MAX//10` und `digit > 7`) → 0. Symmetrisch für MIN.
- **Laufzeit:** O(log n) · **Speicher:** O(1)
- **Fallstricke:** Die Prüfung muss **vor** dem Multiplizieren stehen, sonst ist der Overflow schon passiert. Python: `%` und `//` verhalten sich bei negativen Zahlen anders als in C — mit Betrag rechnen und das Vorzeichen separat führen.

---

## Anhang: 3 Fragen für die letzten 10 Minuten vor einem Interview

1. **Muster-Trigger:** "sortiert" → Binary Search / Two Pointer · "k-te/n größte" → Heap · "alle Möglichkeiten" → Backtracking · "kürzester Weg ungewichtet" → BFS · "Anzahl Wege / min/max über Teilprobleme" → DP · "nächstes größeres" → Monotoner Stack · "Teilstring mit Bedingung" → Sliding Window.
2. **Constraints lesen** und daraus die Zielkomplexität ableiten (Tabelle oben) — *bevor* du anfängst zu programmieren.
3. **Kommuniziere:** Brute Force nennen → Komplexität benennen → Engpass identifizieren → optimieren. Ein erklärter O(n²)-Ansatz schlägt eine schweigend hingeschriebene O(n)-Lösung.
