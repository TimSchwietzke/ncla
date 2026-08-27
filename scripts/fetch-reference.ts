/**
 * Builds `reference/neetcode150.json` — the machine-readable ground truth for all 150
 * problems, fetched from the sources that actually own the data:
 *
 *   - the NeetCode 150 roster (order, category, LeetCode slug, solution filename) comes
 *     from the hardcoded list inside neetcode.io's own `main.<hash>.js` bundle,
 *   - number / difficulty / premium flag from LeetCode's public problem index,
 *   - statement, examples, constraints, follow-up, topic tags and hints from LeetCode's
 *     GraphQL endpoint (the rendered page collapses `10^5` into `105`, the HTML does not),
 *   - the reference solution from NeetCode's own solutions repo.
 *
 * Nothing here is written from memory. Run with `npm run reference:fetch`.
 */

const NEETCODE_LIST_PAGE = "https://neetcode.io/practice/practice/neetcode150";
const LEETCODE_INDEX = "https://leetcode.com/api/problems/all/";
const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const SOLUTION_BASE = "https://raw.githubusercontent.com/neetcode-gh/leetcode/main/python";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

export interface RosterEntry {
  /** Category name exactly as NeetCode spells it. */
  pattern: string;
  title: string;
  leetcodeSlug: string;
  neetcodeSlug: string;
  difficulty: string;
  /** Filename stem in neetcode-gh/leetcode, e.g. "0217-contains-duplicate". */
  code: string;
}

export interface ReferenceProblem extends RosterEntry {
  /** "<category number>.<position>", assigned from the verified order. */
  id: string;
  /**
   * The official LeetCode title. NeetCode title-cases and strips punctuation for its own
   * table ("Kth Smallest Element In a Bst"), so `title` is the display label and this is
   * the name the problem actually has.
   */
  leetcodeTitle: string;
  categoryNumber: number;
  position: number;
  leetcode: number;
  premium: boolean;
  /** Difficulty according to LeetCode, for cross-checking against NeetCode's. */
  leetcodeDifficulty: string;
  statementHtml: string | null;
  /** Plain prose for the seven paid-only problems, where there is no HTML to parse. */
  statementText: string | null;
  /** Where statement, examples and constraints came from. */
  statementSource: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  followUp: string | null;
  topics: string[];
  hints: string[];
  referenceSolution: string | null;
}

interface Override {
  source: string;
  statement: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  followUp: string | null;
}

/**
 * LeetCode serves no content for its paid-only problems. Those seven come from
 * neetcode.io instead, transcribed into `reference/overrides.json` with their source.
 */
async function loadOverrides(): Promise<Record<string, Override>> {
  const { readFile } = await import("node:fs/promises");
  const raw = await readFile("reference/overrides.json", "utf8");
  return (JSON.parse(raw) as { problems: Record<string, Override> }).problems;
}

async function get(url: string, accept = "text/html"): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: accept } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

/** The roster, straight out of neetcode.io's bundle. 150 entries, in list order. */
export async function fetchRoster(): Promise<RosterEntry[]> {
  const page = await get(NEETCODE_LIST_PAGE);
  const bundle = /src="\/?(main\.[a-z0-9]+\.js)"/.exec(page)?.[1];
  if (!bundle) throw new Error("could not find the main.js bundle on the practice page");
  const js = await get(`https://neetcode.io/${bundle}`, "application/javascript");

  const field = (chunk: string, name: string): string | null =>
    new RegExp(`${name}:"((?:[^"\\\\]|\\\\.)*)"`).exec(chunk)?.[1] ?? null;

  const roster: RosterEntry[] = [];
  for (const raw of js.split('{problem:"').slice(1)) {
    const chunk = raw.slice(0, 500);
    if (!chunk.includes("neetcode150:!0")) continue;
    const title = /^((?:[^"\\]|\\.)*)"/.exec(raw)?.[1];
    const pattern = field(chunk, "pattern");
    const link = field(chunk, "link");
    const code = field(chunk, "code");
    const ncLink = field(chunk, "ncLink");
    const difficulty = field(chunk, "difficulty");
    if (!title || !pattern || !link || !code || !difficulty) {
      throw new Error(`incomplete roster entry near: ${chunk.slice(0, 120)}`);
    }
    roster.push({
      pattern,
      title,
      leetcodeSlug: link.replace(/\/$/, ""),
      neetcodeSlug: (ncLink ?? "").replace(/\/$/, ""),
      difficulty,
      code,
    });
  }
  if (roster.length !== 150) {
    throw new Error(`expected 150 NeetCode 150 entries, parsed ${roster.length}`);
  }
  return roster;
}

export interface LeetcodeIndexEntry {
  leetcode: number;
  difficulty: string;
  premium: boolean;
  title: string;
}

/** slug -> { number, difficulty, premium } for every problem on LeetCode. */
export async function fetchLeetcodeIndex(): Promise<Map<string, LeetcodeIndexEntry>> {
  const json = JSON.parse(await get(LEETCODE_INDEX, "application/json"));
  const levels: Record<number, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
  const map = new Map<string, LeetcodeIndexEntry>();
  for (const pair of json.stat_status_pairs) {
    map.set(pair.stat.question__title_slug, {
      leetcode: pair.stat.frontend_question_id,
      difficulty: levels[pair.difficulty.level] ?? "?",
      premium: Boolean(pair.paid_only),
      title: pair.stat.question__title,
    });
  }
  return map;
}

const QUESTION_QUERY = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId title titleSlug content difficulty isPaidOnly hints
    topicTags { name }
  }
}`;

async function fetchQuestion(slug: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UA,
      Referer: `https://leetcode.com/problems/${slug}/`,
    },
    body: JSON.stringify({ query: QUESTION_QUERY, variables: { titleSlug: slug } }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data?.question as Record<string, unknown>) ?? null;
}

async function fetchSolution(code: string): Promise<string | null> {
  const res = await fetch(`${SOLUTION_BASE}/${code}.py`, { headers: { "User-Agent": UA } });
  return res.ok ? res.text() : null;
}

/* ---------- turning LeetCode's HTML into the pieces the MDX files need ---------- */

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&times;": "x",
  "&le;": "<=",
  "&ge;": ">=",
};

/** Keeps `<sup>` as `^`, which is the whole reason we read HTML instead of rendered text. */
function toText(html: string): string {
  return html
    .replace(/<sup>/g, "^")
    .replace(/<\/sup>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/(p|div|li)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractConstraints(html: string): string[] {
  const at = html.search(/<strong[^>]*>\s*Constraints:?\s*<\/strong>/i);
  if (at === -1) return [];
  const list = /<ul>([\s\S]*?)<\/ul>/.exec(html.slice(at));
  if (!list) return [];
  return [...list[1]!.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => toText(m[1]!)).filter(Boolean);
}

function extractFollowUp(html: string): string | null {
  const at = html.search(/<strong[^>]*>\s*Follow[- ]?up:?\s*<\/strong>/i);
  if (at === -1) return null;
  const chunk = html.slice(at).split(/<\/p>|<\/div>/)[0] ?? "";
  const text = toText(chunk).replace(/^Follow[- ]?up:?\s*/i, "");
  return text || null;
}

function extractExamples(html: string): { input: string; output: string; explanation?: string }[] {
  const out: { input: string; output: string; explanation?: string }[] = [];
  const blocks = html.split(/<strong[^>]*class="example"[^>]*>|<strong>\s*Example/i).slice(1);
  for (const block of blocks) {
    const text = toText(block.split(/<strong[^>]*>\s*Constraints/i)[0] ?? "");
    const input = /Input:\s*([\s\S]*?)(?:\n\s*Output:|$)/.exec(text)?.[1]?.trim();
    const output = /Output:\s*([\s\S]*?)(?:\n\s*Explanation:|\n\s*Example|$)/.exec(text)?.[1]?.trim();
    const explanation = /Explanation:\s*([\s\S]*?)(?:\n\s*Example|$)/.exec(text)?.[1]?.trim();
    if (input && output) out.push({ input, output, ...(explanation ? { explanation } : {}) });
  }
  return out;
}

/* ------------------------------------ main ------------------------------------ */

async function main(): Promise<void> {
  process.stdout.write("roster from neetcode.io ... ");
  const roster = await fetchRoster();
  console.log(`${roster.length} problems`);

  process.stdout.write("leetcode problem index ... ");
  const index = await fetchLeetcodeIndex();
  console.log(`${index.size} problems`);

  const overrides = await loadOverrides();
  console.log(`overrides for paid-only problems ... ${Object.keys(overrides).length}`);

  const categories: string[] = [];
  for (const entry of roster) {
    if (!categories.includes(entry.pattern)) categories.push(entry.pattern);
  }

  const counters = new Map<string, number>();
  const problems: ReferenceProblem[] = [];

  for (const entry of roster) {
    const categoryNumber = categories.indexOf(entry.pattern) + 1;
    const position = (counters.get(entry.pattern) ?? 0) + 1;
    counters.set(entry.pattern, position);

    const lc = index.get(entry.leetcodeSlug);
    const question = await fetchQuestion(entry.leetcodeSlug);
    const solution = await fetchSolution(entry.code);
    const html = (question?.["content"] as string | null) ?? null;
    const override = html ? undefined : overrides[entry.leetcodeSlug];

    const problem: ReferenceProblem = {
      ...entry,
      id: `${categoryNumber}.${position}`,
      leetcodeTitle: lc?.title ?? String(question?.["title"] ?? entry.title),
      categoryNumber,
      position,
      leetcode: lc?.leetcode ?? Number(question?.["questionFrontendId"] ?? 0),
      premium: lc?.premium ?? Boolean(question?.["isPaidOnly"]),
      leetcodeDifficulty: lc?.difficulty ?? String(question?.["difficulty"] ?? "?"),
      statementHtml: html,
      statementText: override?.statement ?? null,
      statementSource: html
        ? `https://leetcode.com/problems/${entry.leetcodeSlug}/`
        : (override?.source ?? "none"),
      constraints: html ? extractConstraints(html) : (override?.constraints ?? []),
      examples: html ? extractExamples(html) : (override?.examples ?? []),
      followUp: html ? extractFollowUp(html) : (override?.followUp ?? null),
      topics: ((question?.["topicTags"] as { name: string }[] | undefined) ?? []).map((t) => t.name),
      hints: (question?.["hints"] as string[] | undefined) ?? [],
      referenceSolution: solution,
    };
    problems.push(problem);

    const notes = [
      html || override ? null : "NO STATEMENT",
      solution ? null : "NO SOLUTION FILE",
      problem.constraints.length === 0 ? "no constraints" : null,
      problem.examples.length === 0 ? "no examples (design problem?)" : null,
      override ? "statement from neetcode.io (paid-only on leetcode)" : null,
    ].filter(Boolean);
    console.log(
      `  ${problem.id.padEnd(6)} ${entry.title.slice(0, 50).padEnd(52)} ` +
        (notes.length === 0 ? "ok" : notes.join(", ")),
    );
    await new Promise((r) => setTimeout(r, 250)); // stay polite
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    sources: {
      roster: NEETCODE_LIST_PAGE,
      leetcodeIndex: LEETCODE_INDEX,
      statements: LEETCODE_GRAPHQL,
      solutions: `${SOLUTION_BASE}/<code>.py`,
    },
    categories,
    problems,
  };

  const { writeFile, mkdir } = await import("node:fs/promises");
  await mkdir("reference", { recursive: true });
  await writeFile("reference/neetcode150.json", JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`\nwrote reference/neetcode150.json (${problems.length} problems)`);
}

await main();
