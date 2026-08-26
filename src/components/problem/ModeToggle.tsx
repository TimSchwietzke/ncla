import { BookOpen, GraduationCap, type LucideIcon } from "lucide-react";
import { setMode, useMode, type StudyMode } from "../../lib/mode";

const OPTIONS: { value: StudyMode; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "learn", label: "learn", hint: "Reveal one step at a time", icon: GraduationCap },
  { value: "reference", label: "reference", hint: "Everything open, for revisiting", icon: BookOpen },
];

/**
 * Global and remembered, but placed here: the problem page is the only surface where
 * the mode changes anything, so this is where it is discoverable.
 */
export function ModeToggle() {
  const mode = useMode();

  return (
    <div role="group" aria-label="Study mode" className="flex overflow-hidden rounded-md border border-line">
      {OPTIONS.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setMode(option.value);
            }}
            aria-pressed={active}
            title={option.hint}
            className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 font-mono text-2xs transition-colors ${
              active ? "bg-accent-soft text-accent" : "text-ink-faint hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <option.icon size={12} strokeWidth={1.75} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
