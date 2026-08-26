import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Eye, Repeat, Shapes, Target, type LucideIcon } from "lucide-react";
import { TOTAL_PROBLEMS } from "../data/categories";
import { PATTERNS } from "../data/patterns";
import { PROBLEMS } from "../lib/content";
import { ProgressMosaic } from "../components/ui/ProgressMosaic";
import { ThemeToggle } from "../components/shell/ThemeToggle";
import { HeroVisualizer } from "../components/landing/HeroVisualizer";
import { Reveal } from "../components/landing/Reveal";
import {
  CodeMock,
  RevealMock,
  ScheduleGraphic,
  SignalsMock,
  VisualizerMock,
} from "../components/landing/Mockups";

function Feature({
  icon: Icon,
  eyebrow,
  title,
  children,
  figure,
  reversed = false,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children: ReactNode;
  figure: ReactNode;
  reversed?: boolean;
}) {
  return (
    <Reveal className="border-t border-line py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reversed ? "lg:order-2" : undefined}>
          <p className="flex items-center gap-2 font-mono text-2xs uppercase tracking-wider text-accent">
            <Icon size={14} strokeWidth={1.75} />
            {eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[1.75rem] leading-tight tracking-tight text-balance sm:text-[2.125rem]">
            {title}
          </h2>
          <div className="mt-4 max-w-[54ch] space-y-3 text-prose leading-relaxed text-ink-muted">
            {children}
          </div>
        </div>
        <div className={reversed ? "lg:order-1" : undefined}>{figure}</div>
      </div>
    </Reveal>
  );
}

export default function Landing() {
  const written = PROBLEMS.length;

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-3">
          <span className="text-lg font-semibold tracking-tight">
            ncla
            <span className="ml-2 font-mono text-2xs font-normal text-ink-faint">neetcode 150</span>
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden w-[104px] sm:block">
              <ThemeToggle />
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-md border border-accent bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              Open the app
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6">
        <section className="py-20 text-center lg:py-28">
          <p className="font-mono text-2xs uppercase tracking-[0.18em] text-ink-faint">
            {TOTAL_PROBLEMS} problems · {PATTERNS.length} patterns · one method
          </p>
          <h1 className="mx-auto mt-6 max-w-[20ch] font-serif text-[2.75rem] leading-[1.05] tracking-tight text-balance sm:text-[4rem]">
            Stop memorising solutions.
          </h1>
          <p className="mx-auto mt-6 max-w-[58ch] text-prose leading-relaxed text-ink-muted sm:text-lg">
            An interview never asks you a problem you have practised. It asks one you have not — and
            the only thing that carries over is the pattern underneath. ncla teaches the eighteen of
            them that cover all 150.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Start learning
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <Link
              to="/method"
              className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-line-strong"
            >
              How to attack an unknown problem
            </Link>
          </div>

          <div className="mx-auto mt-16 max-w-[720px]">
            <HeroVisualizer />
          </div>
        </section>

        <Feature
          icon={Shapes}
          eyebrow="Recognise it"
          title="Every problem is wearing a pattern. Learn to see it through the costume."
          figure={<SignalsMock />}
        >
          <p>
            The hard part of an unfamiliar problem is not the code, it is the first thirty seconds.
            Every write-up starts with the words and constraints that give the pattern away — the
            signal, not just the answer.
          </p>
          <p>
            Eighteen patterns, each with the sentence that triggers it and every problem it appears
            in.
          </p>
        </Feature>

        <Feature
          icon={Target}
          eyebrow="Say it out loud"
          title="Name the naive answer, find its bottleneck, then beat it."
          figure={<CodeMock />}
          reversed
        >
          <p>
            An explained brute force beats a silently written optimal solution. So every problem
            walks the same arc: the obvious approach, its complexity, the one line that is doing too
            much work — and only then the optimal solution.
          </p>
          <p>
            Runnable Python with the LeetCode signature, and comments only where a line is not
            obvious.
          </p>
        </Feature>

        <Feature
          icon={Eye}
          eyebrow="Nothing is spoiled"
          title="Reveal one step at a time, when you are actually stuck."
          figure={<RevealMock />}
        >
          <p>
            Learn mode shows the problem and nothing else. When you are stuck you unlock exactly one
            step: the target complexity, then the pattern hint, then the insight — never the whole
            answer by accident.
          </p>
          <p>What is still locked is not in the page at all, so it cannot be spoiled by scrolling.</p>
        </Feature>

        <Feature
          icon={Repeat}
          eyebrow="Make it stick"
          title="Come back to it three days later, before it fades."
          figure={<ScheduleGraphic />}
          reversed
        >
          <p>
            Rate yourself honestly after each attempt and the problem schedules itself: one day when
            you had no idea, fourteen when it was clean and fast. Two good runs in a row and the
            interval starts growing.
          </p>
          <p>
            Everything lives in your browser. No account, no backend, and an export button because
            of it.
          </p>
        </Feature>

        <Feature
          icon={Shapes}
          eyebrow="See it move"
          title="Watch the algorithm run, one frame at a time."
          figure={<VisualizerMock />}
        >
          <p>
            Pointers converging, a window growing and shrinking, a DP table filling in. Each pattern
            gets a step-by-step player you can pause, rewind and feed your own input.
          </p>
          <p>Every problem seeds it with its own example, so the sketch is never generic.</p>
        </Feature>

        <Reveal className="border-t border-line py-16 lg:py-24">
          <div className="text-center">
            <p className="font-mono text-2xs uppercase tracking-wider text-accent">The whole list</p>
            <h2 className="mx-auto mt-4 max-w-[24ch] font-serif text-[1.75rem] leading-tight tracking-tight text-balance sm:text-[2.125rem]">
              All {TOTAL_PROBLEMS} problems, in the order that actually builds on itself.
            </h2>
          </div>
          <div className="mt-10 flex justify-center">
            <ProgressMosaic />
          </div>
          <p className="mt-6 text-center font-mono text-2xs text-ink-faint">
            <span className="text-ink">{written}</span> written up ·{" "}
            {TOTAL_PROBLEMS - written} to go
          </p>
        </Reveal>

        <Reveal className="border-t border-line py-20 text-center lg:py-28">
          <h2 className="mx-auto max-w-[20ch] font-serif text-[2rem] leading-tight tracking-tight text-balance sm:text-[2.75rem]">
            Three to four a day. About seven weeks.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-prose leading-relaxed text-ink-muted">
            Two problems genuinely understood are worth more than eight ticked off. A missed day is
            not a reason to abandon the plan.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Open the app
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </Reveal>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-6 py-8 font-mono text-2xs text-ink-faint">
          <span>ncla · personal preparation · everything stored locally</span>
          <span className="flex gap-4">
            <Link to="/method" className="hover:text-ink">
              method
            </Link>
            <Link to="/patterns" className="hover:text-ink">
              patterns
            </Link>
            <Link to="/cheat-sheet" className="hover:text-ink">
              cheat sheet
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
