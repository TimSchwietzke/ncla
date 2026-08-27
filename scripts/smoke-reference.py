"""Runs every reference solution in reference/neetcode150.json against LeetCode's own examples.

This is a net, not a proof. It drives problems whose input is a list of `name = value`
pairs and whose output is a literal — which is most of them. Design problems (an operation
log instead of one call), problems that mutate their input in place, and tree or linked-list
problems whose input needs to be built from a serialised array are reported as NOT COVERED
rather than silently passed or wrongly failed.

The sharp test — brute force against optimal on random inputs — happens per category while
the MDX files are written. This one catches broken files, missing imports and gross
wrongness across the whole set in a single run.

Usage: python scripts/smoke-reference.py [category-number]
Exit code 1 if any solution ran and produced the wrong answer.
"""

from __future__ import annotations

import bisect
import collections
import contextlib
import io
import functools
import heapq
import itertools
import json
import math
import re
import string
import sys
from collections import Counter, OrderedDict, defaultdict, deque
from functools import cache, lru_cache
from heapq import heapify, heappop, heappush, heappushpop, nlargest, nsmallest
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[1]
REFERENCE = REPO / "reference" / "neetcode150.json"


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


class Node:
    def __init__(self, val=0, neighbors=None, next=None, random=None, left=None, right=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
        self.next, self.random, self.left, self.right = next, random, left, right


#: Names NeetCode's files use without importing them. The repo leans on the LeetCode
#: editor's preamble, so a bare `collections.deque` or `heapq.heappush` is common.
NAMESPACE_BASE: dict[str, Any] = {
    "List": list, "Dict": dict, "Set": set, "Tuple": tuple, "Optional": Any,
    "ListNode": ListNode, "TreeNode": TreeNode, "Node": Node,
    "collections": collections, "heapq": heapq, "itertools": itertools,
    "functools": functools, "bisect": bisect, "math": math, "string": string, "re": re,
    "Counter": Counter, "OrderedDict": OrderedDict, "defaultdict": defaultdict,
    "deque": deque, "cache": cache, "lru_cache": lru_cache,
    "heapify": heapify, "heappop": heappop, "heappush": heappush,
    "heappushpop": heappushpop, "nlargest": nlargest, "nsmallest": nsmallest,
}

#: Files in neetcode-gh/leetcode that do not parse as Python. Reported, but they do not
#: fail the run — they are upstream bugs, not ours. Anything NEW that breaks does fail,
#: which is the point of listing them by name instead of ignoring errors.
KNOWN_UPSTREAM_BREAKAGE = {
    "0200-number-of-islands": "SolutionBFS: inner def bfs indented by 9 spaces (line 60)",
    "0261-graph-valid-tree": "a second class Solution nested inside the first (line 37)",
}

#: Parameters that arrive as a serialised array but must be a real node structure.
STRUCTURAL_TYPES = (
    "head", "headA", "headB", "root", "l1", "l2", "list1", "list2", "lists",
    "node", "subRoot", "p", "q", "nodes",
)


def literals(text: str) -> Any:
    """LeetCode writes JSON-ish values; make them Python."""
    return eval(text, {"__builtins__": {}}, {"true": True, "false": False, "null": None,
                                             "True": True, "False": False, "None": None})


def split_arguments(text: str) -> list[str]:
    """Split `nums = [1,2], target = 3` on the commas that are not inside brackets or quotes."""
    parts, depth, quote, start = [], 0, "", 0
    for i, ch in enumerate(text):
        if quote:
            if ch == quote and text[i - 1] != "\\":
                quote = ""
        elif ch in "\"'":
            quote = ch
        elif ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        elif ch == "," and depth == 0:
            parts.append(text[start:i])
            start = i + 1
    parts.append(text[start:])
    return [p.strip() for p in parts if p.strip()]


def parse_input(text: str) -> dict[str, Any] | None:
    """`nums = [2,7], target = 9` -> {"nums": [2,7], "target": 9}. None if it is not that shape."""
    arguments: dict[str, Any] = {}
    for part in split_arguments(text.replace("\n", " ")):
        match = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$", part, re.S)
        if not match:
            return None
        try:
            arguments[match.group(1)] = literals(match.group(2).strip())
        except Exception:
            return None
    return arguments or None


def as_lists(value: Any) -> Any:
    """Tuples and lists are the same answer; LeetCode always prints lists."""
    if isinstance(value, (list, tuple)):
        return [as_lists(v) for v in value]
    return value


def unordered(value: Any) -> Any:
    """A canonical form that ignores order at every level."""
    if isinstance(value, list):
        return sorted((unordered(v) for v in value), key=repr)
    return value


def compare(actual: Any, expected: Any) -> str:
    """exact / unordered / close / no. Never silently accepts a different order —
    'unordered' is reported so a real ordering bug cannot hide behind it."""
    a, e = as_lists(actual), as_lists(expected)
    if a == e:
        return "exact"
    if isinstance(a, float) or isinstance(e, float):
        try:
            if math.isclose(float(a), float(e), rel_tol=1e-6, abs_tol=1e-6):
                return "close"
        except (TypeError, ValueError):
            pass
        return "no"
    if isinstance(a, list) and isinstance(e, list) and unordered(a) == unordered(e):
        return "unordered"
    return "no"


def solve(problem: dict) -> tuple[str, str]:
    """Returns (verdict, detail) where verdict is ok / MISMATCH / not covered / ERROR."""
    source = problem.get("referenceSolution")
    if not source:
        return "not covered", "no reference solution"
    examples = problem.get("examples") or []
    if not examples:
        return "not covered", "no parsable examples (design problem)"

    namespace = dict(NAMESPACE_BASE)
    try:
        with contextlib.redirect_stdout(io.StringIO()):   # some files print while solving
            exec(compile(source, problem["code"] + ".py", "exec"), namespace)
    except Exception as error:                            # a file that will not even import
        known = KNOWN_UPSTREAM_BREAKAGE.get(problem["code"])
        if known:
            return "upstream broken", known
        return "ERROR", f"import failed: {type(error).__name__}: {error}"

    solution_class = namespace.get("Solution")
    if solution_class is None:
        return "not covered", "no class Solution (design problem)"

    methods = [n for n in vars(solution_class) if not n.startswith("_")
               and callable(getattr(solution_class, n))]
    if not methods:
        return "not covered", "class Solution has no public method"
    lowered = {m.lower() for m in methods}
    for out_, in_ in (("encode", "decode"), ("serialize", "deserialize")):
        if out_ in lowered and in_ in lowered:
            return "not covered", f"{out_}/{in_} round trip, not a single call"

    first = parse_input(examples[0]["input"])
    if first is None:
        return "not covered", "input is not `name = value`"
    if any(key in STRUCTURAL_TYPES for key in first):
        return "not covered", "input needs a linked list or tree"

    # Several files keep two alternative solutions plus helpers in one class. Pick the
    # entry point by matching parameter names against the example, not by hoping there
    # is only one.
    def parameters(name: str) -> list[str]:
        import inspect
        try:
            return [p for p in inspect.signature(getattr(solution_class, name)).parameters
                    if p != "self"]
        except (TypeError, ValueError):
            return []

    wanted = set(first)
    exact = [m for m in methods if set(parameters(m)) == wanted]
    same_arity = [m for m in methods if len(parameters(m)) == len(wanted)]
    candidates = exact or same_arity
    if len(candidates) != 1:
        return "not covered", f"{len(methods)} public methods, cannot pick the entry point"
    method_name = candidates[0]
    positional = method_name not in exact

    checked = 0
    loose = ""
    for example in examples:
        arguments = parse_input(example["input"])
        if arguments is None:
            return "not covered", "input is not `name = value`"
        try:
            expected = literals(example["output"].strip())
        except Exception:
            return "not covered", "output is not a literal"
        try:
            method = getattr(solution_class(), method_name)
            with contextlib.redirect_stdout(io.StringIO()):
                actual = method(*arguments.values()) if positional else method(**arguments)
        except TypeError as error:
            return "not covered", f"signature mismatch: {error}"
        except Exception as error:
            return "ERROR", f"{type(error).__name__}: {error}"
        if actual is None and expected is not None:
            return "not covered", "solution mutates its input in place"
        if isinstance(actual, (TreeNode, ListNode, Node)):
            return "not covered", "returns a tree or list node, not a literal"
        verdict = compare(actual, expected)
        if verdict == "no":
            return "MISMATCH", f"{example['input']} -> {actual!r}, expected {expected!r}"
        if verdict != "exact":
            loose = verdict
        checked += 1
    return "ok", f"{checked} example(s)" + (f", {loose}" if loose else "")


def main() -> int:
    data = json.loads(REFERENCE.read_text(encoding="utf-8"))
    problems = data["problems"]
    if len(sys.argv) > 1:
        problems = [p for p in problems if p["categoryNumber"] == int(sys.argv[1])]

    buckets: dict[str, list[tuple[dict, str]]] = defaultdict(list)
    for problem in problems:
        verdict, detail = solve(problem)
        buckets[verdict].append((problem, detail))

    for verdict in ("MISMATCH", "ERROR", "upstream broken", "not covered"):
        rows = buckets.get(verdict, [])
        if not rows:
            continue
        print(f"\n{verdict} ({len(rows)})")
        for problem, detail in rows:
            print(f"  {problem['id']:<6} {problem['leetcodeTitle'][:44]:<46} {detail}")

    ok = len(buckets.get("ok", []))
    bad = len(buckets.get("MISMATCH", [])) + len(buckets.get("ERROR", []))
    print(f"\n{ok} verified against LeetCode's own examples · "
          f"{len(buckets.get('not covered', []))} not covered · {bad} wrong")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
